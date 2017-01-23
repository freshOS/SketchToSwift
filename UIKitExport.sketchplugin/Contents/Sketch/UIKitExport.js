function onRun(context) { // Comment to launch script in Sketch "Custom Script"

  var isArtboardSelected = false
  var selection = context.api().selectedDocument.selectedLayers

  selection.iterate(function(item) {
    if (item.isArtboard) {
      isArtboardSelected = true
    }
  });

  if (isArtboardSelected) {
    parseArtboard(context)
  } else {
    parseSingleElement(context)
  }
}; // Comment to launch script in Sketch "Custom Script" 


function parseSingleElement(context) { 
  var lines = []
  var selection = context.api().selectedDocument.selectedLayers
  selection.iterate(function(item) {
    if (item.isText) {
      write(uikitDeclarationsForSingleText(item))
      write(`${sanitizeName(item.name)}.text = "${item.text}"`)
      write(uikitStyleForText(item))
    }
  });

  // Print + copy
  var fullText = ""
  lines.forEach(function(line) {
    fullText += line + "\n"
  })
  log(fullText)
  copyText(fullText)


  function write(text) {
    lines.push(text)
  }

}


function parseArtboard(context) {

  var selection = context.api().selectedDocument.selectedLayers
  var labels = []
  var buttons = []
  var shapes = []
  var allElements = []
  var lines = []

  var artboardName = "DefaultViewName"
  var artboardBackgroundColor = nil

  selection.iterate(function(item) {
    if (item.isArtboard) {
      artboardName = `${removeSpaces(item.name)}View`
      artboardBackgroundColor = item.sketchObject.backgroundColor()
      item.iterate(function(element) {
        if (element.isText) {
          labels.push(element)
        } else if (element.isShape) {
          shapes.push(element)
        } else if (element.isGroup) {
          // buttons?
          buttons.push(element)
        }
        allElements.push(element)
      })
    }
  });


  allElements = allElements.reverse()
  labels = labels.reverse()
  shapes = shapes.reverse()
  buttons = buttons.reverse()


  // Header
  write(uikitHeader(artboardName))
  write("")

  // Declarations
  write(uikitDeclarationsFor(allElements))

  // Init
  write(uiviewInit())

  // View Hierarchy
  write("")
  write(uikitViewHierarchy(allElements))

  // Layout
  write(uikitLayout(allElements))
  write("")

  // Style

  // Artboard Background Color
  write(`        backgroundColor = ${uiColorLineForColor(artboardBackgroundColor)}`)


  labels.map(function(l) {
    write(uikitStyleForText(l))
  });
  shapes.map(function(v) {
    var elementName = sanitizeName(v.name)
    var color = v.sketchObject.style().fills()[0].color()
    write(`        ${elementName}.backgroundColor = ${uiColorLineForColor(color)}`)
    write("")
  });


  // Buttons
  buttons.map(function(v) {
    var elementName = sanitizeName(v.name)
    v.iterate(function(item) {
      if (item.isText) {
        write(`        ${elementName}.setTitle("${item.text}",for: .normal)`)
        //Title color
        var color = item.sketchObject.textColor()
        write(`        ${elementName}.setTitleColor(${uiColorLineForColor(color)}, for: . normal)`)

        // Button font
        var fontName = item.sketchObject.fontPostscriptName()
        var fontSize = item.sketchObject.fontSize()
        if (fontName == "SFUIText-Semibold") {
          write(`        ${elementName}.titleLabel?.font = .systemFont(ofSize: ${fontSize}, weight: UIFontWeightSemibold)`)
        } else if (fontName == "SFUIText-Regular") {
          write(`        ${elementName}.titleLabel?.font = .systemFont(ofSize: ${fontSize})`)
        } else {
          write(`        ${elementName}.titleLabel?.font = UIFont(name: "${fontName}", size:${fontSize})`)
        }
      } else if (item.isShape) {
        var color = item.sketchObject.style().fills()[0].color()
        write(`        ${elementName}.backgroundColor = ${uiColorLineForColor(color)}`)
      }
    });
    write("")
  });


  // Content
  write(uikitContentForLabels(labels))


  // Print + copy
  var fullText = ""
  lines.forEach(function(line) {
    fullText += line + "\n"
  })
  log(fullText)
  copyText(fullText)


  function write(text) {
    lines.push(text)
  }
}

function uikitStyleForText(l) {
    var s = ""
    var elementName = sanitizeName(l.name)

    // Special case for native fonts
    var fontName = l.sketchObject.fontPostscriptName()
    var fontSize = l.sketchObject.fontSize()

    if (fontName == "SFUIText-Semibold") {
      s += `${elementName}.font = .systemFont(ofSize: ${fontSize}, weight: UIFontWeightSemibold)`
    } else if (fontName == "SFUIText-Regular") {
      s += `${elementName}.font = .systemFont(ofSize: ${fontSize})`
    } else if (fontName == "SFUIText-Italic") {
      s += `${elementName}.font = .italicSystemFont(ofSize: ${fontSize})`
    } else if (fontName == "SFUIText-Light") {
      s += `${elementName}.font = .systemFont(ofSize: ${fontSize}, weight: UIFontWeightLight)`
    } else if (fontName == "SFUIText-Heavy") {
      s += `${elementName}.font = .systemFont(ofSize: ${fontSize}, weight: UIFontWeightHeavy)`
    } else if (fontName == "SFUIText-Bold") {
      s += `${elementName}.font = .systemFont(ofSize: ${fontSize}, weight: UIFontWeightBold)`
    } else if (fontName == "SFUIText-Medium") {
      s += `${elementName}.font = .systemFont(ofSize: ${fontSize}, weight: UIFontWeightMedium)`
    } else if (fontName == "SFUIText-LightItalic") {
      var fontName = `${elementName}Font`
      var fontDescriptorName = `${elementName}Descriptor`
      s += `var ${fontName}: UIFont = .systemFont(ofSize:${fontSize}, weight: UIFontWeightLight)`
      s += `let ${fontDescriptorName} = ${fontName}.fontDescriptor.withSymbolicTraits(.traitItalic)`
      s += `${fontName} = UIFont(descriptor: ${fontDescriptorName}!, size: 0)`
      s += `${elementName}.font = ${fontName}`
    } else if (fontName == "SFUIText-MediumItalic") {
          var fontName = `${elementName}Font`
          var fontDescriptorName = `${elementName}Descriptor`
          s += `var ${fontName}: UIFont = .systemFont(ofSize:${fontSize}, weight: UIFontWeightMedium)`
          s += "\n"
          s += `let ${fontDescriptorName} = ${fontName}.fontDescriptor.withSymbolicTraits(.traitItalic)`
          s += "\n"
          s += `${fontName} = UIFont(descriptor: ${fontDescriptorName}!, size: 0)`
          s += "\n"
          s += `${elementName}.font = ${fontName}`
    } else if (fontName == "SFUIText-SemiboldItalic") {
          var fontName = `${elementName}Font`
          var fontDescriptorName = `${elementName}Descriptor`
          s += `var ${fontName}: UIFont = .systemFont(ofSize:${fontSize}, weight: UIFontWeightSemibold)`
          s += "\n"
          s += `let ${fontDescriptorName} = ${fontName}.fontDescriptor.withSymbolicTraits(.traitItalic)`
          s += "\n"
          s += `${fontName} = UIFont(descriptor: ${fontDescriptorName}!, size: 0)`
          s += "\n"
          s += `${elementName}.font = ${fontName}`
    } else if (fontName == "SFUIText-BoldItalic") {
          var fontName = `${elementName}Font`
          var fontDescriptorName = `${elementName}Descriptor`
          s += `var ${fontName}: UIFont = .systemFont(ofSize:${fontSize})`
          s += "\n"
          s += `let ${fontDescriptorName} = ${fontName}.fontDescriptor.withSymbolicTraits([.traitItalic, .traitBold])`
          s += "\n"
          s += `${fontName} = UIFont(descriptor: ${fontDescriptorName}!, size: 0)`
          s += "\n"
          s += `${elementName}.font = ${fontName}`
    } else if (fontName == "SFUIText-HeavyItalic") {
          var fontName = `${elementName}Font`
          var fontDescriptorName = `${elementName}Descriptor`
          s += `var ${fontName}: UIFont = .systemFont(ofSize:${fontSize}, weight: UIFontWeightHeavy)`
          s += "\n"
          s += `let ${fontDescriptorName} = ${fontName}.fontDescriptor.withSymbolicTraits(.traitItalic)`
          s += "\n"
          s += `${fontName} = UIFont(descriptor: ${fontDescriptorName}!, size: 0)`
          s += "\n"
          s += `${elementName}.font = ${fontName}`
    } else {
      s += `${elementName}.font = UIFont(name: "${fontName}", size:${fontSize})`
    }
    s += "\n"
    s += uicolorforText(l)
    s += "\n"
    if (l.alignment == "center") {
      s += `${elementName}.textAlignment = .center`
      s += "\n"
    }
    s += `${elementName}.numberOfLines = 0`
    s += ""
    return s
}

function uicolorforText(text) {
   return `${sanitizeName(text.name)}.textColor = ${uiColorLineForColor(text.sketchObject.textColor())}`
}

function uiColorLineForColor(color) {

    let colorMap = {
        "1111": "white",
        "0001": "black",
        "1001": "red",
        "0101": "green",
        "0011": "blue",
        "0111": "cyan",
        "1011": "magenta",
        "10.501": "orange",
        "0.500.51": "purple",
        "0.60.40.21": "brown",
        "1101": "yellow",
        "0.50.50.51": "gray",
        "0.670.670.671": "lightGray",
        "0.330.330.331": "darkGray",
        "0000": "clear"
    }

    var red = Math.round(color.red() * 100) / 100
    var green = Math.round(color.green() * 100) / 100  
    var blue = Math.round(color.blue() * 100) / 100  
    var alpha = Math.round(color.alpha() * 100) / 100  
    let colorKey = `${red}${green}${blue}${alpha}`
    var color = colorMap[colorKey]
    if (color != undefined) {
      return `.${color}`
    }
        
    return `UIColor(red: ${red}, green: ${green}, blue: ${blue}, alpha: ${alpha})`
}


function uikitHeader(viewName) {
  return `import UIKit


class ${viewName} : UIView {`
}

function uiviewInit() {
  return `    override init(frame: CGRect) {
        super.init(frame: frame)
        commonInit()
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        commonInit()
    }
    
    private func commonInit() {
        `
}

function uikitDeclarationsFor(elements) {
  var s = "" 
  elements.map(function(e) {
    s += uikitDeclarationsForSingle(e)
    s += "\n"
  });
  return s
}

function uikitDeclarationsForSingleText(e) {
  return uikitDeclarationsForSingle(e)
}

function uikitDeclarationsForSingle(e) {
  var s = ""
    if (e.isText) {
      s += uikitDeclarationsForText(e)
    } else if (e.isShape) {
      s += `    let ${sanitizeName(e.name)} = UIView()\n`
    } else if (e.isGroup) {
      // Only if contains button
      s += `    let ${sanitizeName(e.name)} = UIButton()\n`
    }
  return s
}


function uikitDeclarationsForText(e) {
   return `let ${sanitizeName(e.name)} = UILabel()`
}


function uikitViewHierarchy(elements) {
  var s = ""
  elements.map(function(e) {
    s += `        ${sanitizeName(e.name)}.translatesAutoresizingMaskIntoConstraints = false` + "\n"
  });
  s += "\n"
  elements.reverse().map(function(e) {
    s += `        addSubview(${sanitizeName(e.name)})` + "\n"
  });
  return s
}

function uikitLayout(elements) {
  var s = "\n"
  elements.map(function(v) {
    var elementName = sanitizeName(v.name)
    // Top
    s += `        addConstraint(
          NSLayoutConstraint(item: ${elementName},
                             attribute: .top,
                             relatedBy: .equal,
                             toItem: self,
                             attribute: .top,
                             multiplier: 1,
                             constant: ${v.frame.y})
        )

`

    // Left
    s += `        addConstraint(
          NSLayoutConstraint(item: ${elementName},
                             attribute: .left,
                             relatedBy: .equal,
                             toItem: self,
                             attribute: .left,
                             multiplier: 1,
                             constant: ${v.frame.x})
        )

`

    // Width
    s += `        addConstraint(
          NSLayoutConstraint(item: ${elementName},
                             attribute: .width,
                             relatedBy: .equal,
                             toItem: nil,
                             attribute: .notAnAttribute,
                             multiplier: 1,
                             constant: ${v.frame.width})
        )

`

    // Height
    s += `        addConstraint(
          NSLayoutConstraint(item: ${elementName},
                             attribute: .height,
                             relatedBy: .equal,
                             toItem: nil,
                             attribute: .notAnAttribute,
                             multiplier: 1,
                             constant: ${v.frame.height})
        )

`
  });
  return s
}

function uikitContentForLabels(labels) {
  var contentStr = labels.map(
    l => `        ${sanitizeName(l.name)}.text = "${l.text}"`
  ).join('\n')

  var s = "        // Content \n"
  s += `${contentStr}
      }
  }`
  return s
}

function copyText(text) {
  var pasteBoard = [NSPasteboard generalPasteboard];
  [pasteBoard declareTypes: [NSArray arrayWithObject: NSPasteboardTypeString] owner: nil];
  [pasteBoard setString: text forType: NSPasteboardTypeString];
}

function sanitizeName(str) {
  return lowerCaseFirstLetter(removeSpaces(str))
}

function lowerCaseFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

function removeSpaces(str) {
  return str.replace(/\s+/g, '');
}
