function onRun(context) {

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
  write(`        // Style`)

  // Artboard Background Color
  var red = artboardBackgroundColor.red()
  var green = artboardBackgroundColor.green()
  var blue = artboardBackgroundColor.blue()
  var alpha = artboardBackgroundColor.alpha()
  write(`        backgroundColor = UIColor(red: ${red}, green: ${green}, blue: ${blue}, alpha: ${alpha})`)

  labels.map(function(l) {
    var elementName = sanitizeName(l.name)
    var red = l.sketchObject.textColor().red()
    var green = l.sketchObject.textColor().green()
    var blue = l.sketchObject.textColor().blue()
    var alpha = l.sketchObject.textColor().alpha()

    // Special case for native fonts
    var fontName = l.sketchObject.fontPostscriptName()
    var fontSize = l.sketchObject.fontSize()

    if (fontName == "SFUIText-Semibold") {
      write(`        ${elementName}.font = .systemFont(ofSize: ${fontSize}, weight: UIFontWeightSemibold)`)
    } else if (fontName == "SFUIText-Regular") {
      write(`        ${elementName}.font = .systemFont(ofSize: ${fontSize})`)
    } else if (fontName == "SFUIText-Italic") {
      write(`        ${elementName}.font = .italicSystemFont(ofSize: ${fontSize})`)
    } else if (fontName == "SFUIText-Light") {
      write(`        ${elementName}.font = .systemFont(ofSize: ${fontSize}, weight: UIFontWeightLight)`)
    } else if (fontName == "SFUIText-Heavy") {
      write(`        ${elementName}.font = .systemFont(ofSize: ${fontSize}, weight: UIFontWeightHeavy)`)
    } else if (fontName == "SFUIText-Bold") {
      write(`        ${elementName}.font = .systemFont(ofSize: ${fontSize}, weight: UIFontWeightBold)`)
    } else if (fontName == "SFUIText-Medium") {
      write(`        ${elementName}.font = .systemFont(ofSize: ${fontSize}, weight: UIFontWeightMedium)`)
    } else if (fontName == "SFUIText-LightItalic") {
      var fontName = `${elementName}Font`
      var fontDescriptorName = `${elementName}Descriptor`
      write(`        var ${fontName}: UIFont = .systemFont(ofSize:${fontSize}, weight: UIFontWeightLight)`)
      write(`        let ${fontDescriptorName} = ${fontName}.fontDescriptor.withSymbolicTraits(.traitItalic)`)
      write(`        ${fontName} = UIFont(descriptor: ${fontDescriptorName}!, size: 0)`)
      write(`        ${elementName}.font = ${fontName}`)
    } else if (fontName == "SFUIText-MediumItalic") {
          var fontName = `${elementName}Font`
          var fontDescriptorName = `${elementName}Descriptor`
          write(`        var ${fontName}: UIFont = .systemFont(ofSize:${fontSize}, weight: UIFontWeightMedium)`)
          write(`        let ${fontDescriptorName} = ${fontName}.fontDescriptor.withSymbolicTraits(.traitItalic)`)
          write(`        ${fontName} = UIFont(descriptor: ${fontDescriptorName}!, size: 0)`)
          write(`        ${elementName}.font = ${fontName}`)
    } else if (fontName == "SFUIText-SemiboldItalic") {
          var fontName = `${elementName}Font`
          var fontDescriptorName = `${elementName}Descriptor`
          write(`        var ${fontName}: UIFont = .systemFont(ofSize:${fontSize}, weight: UIFontWeightSemibold)`)
          write(`        let ${fontDescriptorName} = ${fontName}.fontDescriptor.withSymbolicTraits(.traitItalic)`)
          write(`        ${fontName} = UIFont(descriptor: ${fontDescriptorName}!, size: 0)`)
          write(`        ${elementName}.font = ${fontName}`)
    } else if (fontName == "SFUIText-BoldItalic") {
          var fontName = `${elementName}Font`
          var fontDescriptorName = `${elementName}Descriptor`
          write(`        var ${fontName}: UIFont = .systemFont(ofSize:${fontSize})`)
          write(`        let ${fontDescriptorName} = ${fontName}.fontDescriptor.withSymbolicTraits([.traitItalic, .traitBold])`)
          write(`        ${fontName} = UIFont(descriptor: ${fontDescriptorName}!, size: 0)`)
          write(`        ${elementName}.font = ${fontName}`)
    }
    else if (fontName == "SFUIText-HeavyItalic") {
          var fontName = `${elementName}Font`
          var fontDescriptorName = `${elementName}Descriptor`
          write(`        var ${fontName}: UIFont = .systemFont(ofSize:${fontSize}, weight: UIFontWeightHeavy)`)
          write(`        let ${fontDescriptorName} = ${fontName}.fontDescriptor.withSymbolicTraits(.traitItalic)`)
          write(`        ${fontName} = UIFont(descriptor: ${fontDescriptorName}!, size: 0)`)
          write(`        ${elementName}.font = ${fontName}`)
    } else {
      write(`        ${elementName}.font = UIFont(name: "${fontName}", size:${fontSize})`)
    }

    write(`        ${elementName}.textColor =  UIColor(red: ${red}, green: ${green}, blue: ${blue}, alpha: ${alpha})`)
    if (l.alignment == "center") {
      write(`        ${elementName}.textAlignment = .center`)
    }
    write(`        ${elementName}.numberOfLines = 0`)
    write("")
  });
  shapes.map(function(v) {
    var elementName = sanitizeName(v.name)
    var color = v.sketchObject.style().fills()[0].color()
    var red = color.red()
    var green = color.green()
    var blue = color.blue()
    var alpha = color.alpha()
    write(`        ${elementName}.backgroundColor = UIColor(red: ${red}, green: ${green}, blue: ${blue}, alpha: $alpha)`)
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
        var red = color.red()
        var green = color.green()
        var blue = color.blue()
        var alpha = color.alpha()
        write(`        ${elementName}.setTitleColor(UIColor(red: ${red}, green: ${green}, blue: ${blue}, alpha: ${alpha}), for: . normal)`)

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
        var red = color.red()
        var green = color.green()
        var blue = color.blue()
        var alpha = color.alpha()
        write(`        ${elementName}.backgroundColor = UIColor(red: ${red}, green: ${green}, blue: ${blue}, alpha: ${alpha})`)
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
};


function uikitHeader(viewName) {
  return `import UIKit


class ${viewName} : UIView {

  `
}

function uiviewInit() {
  return `    convenience init() {
        self.init(frame:CGRect.zero)`
}

function uikitDeclarationsFor(elements) {
  var s = ""
  elements.map(function(e) {
    if (e.isText) {
      s += `    let ${sanitizeName(e.name)} = UILabel()\n`
    } else if (e.isShape) {
      s += `    let ${sanitizeName(e.name)} = UIView()\n`
    } else if (e.isGroup) {
      // Only if contains button
      s += `    let ${sanitizeName(e.name)} = UIButton()\n`
    }
  });
  return s
}

function uikitViewHierarchy(elements) {
  var s = `       // View Hierarchy` + "\n"
  elements.map(function(e) {
    s += `        ${sanitizeName(e.name)}.translatesAutoresizingMaskIntoConstraints = false` + "\n"
  });
  elements.reverse().map(function(e) {
    s += `        addSubview(${sanitizeName(e.name)})` + "\n"
  });
  return s
}

function uikitLayout(elements) {
  var s = "\n"
  s += "        // Layout" + "\n"
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
             )`

    // Left
    s += `        addConstraint(
                NSLayoutConstraint(item: ${elementName},
                                   attribute: .left,
                                   relatedBy: .equal,
                                   toItem: self,
                                   attribute: .left,
                                   multiplier: 1,
                                   constant: ${v.frame.x})
             )`

    // Width
    s += `        addConstraint(
                NSLayoutConstraint(item: ${elementName},
                                   attribute: .width,
                                   relatedBy: .equal,
                                   toItem: nil,
                                   attribute: .notAnAttribute,
                                   multiplier: 1,
                                   constant: ${v.frame.width})
             )`

    // Height
    s += `        addConstraint(
                NSLayoutConstraint(item: ${elementName},
                                   attribute: .height,
                                   relatedBy: .equal,
                                   toItem: nil,
                                   attribute: .notAnAttribute,
                                   multiplier: 1,
                                   constant: ${v.frame.height})
             )`
  });
  return s
}

function uikitContentForLabels(labels) {
  var s = "\n"
  s += `        // Content
          ${
    labels.map(function(l) {
      s += `${sanitizeName(l.name)}.text = "${l.text}"`
    }).join('\n')
  }

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
