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
      artboardName = removeSpaces(item.name) + "View"
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
  write(steviaHeader(artboardName))

  // Declarations
  write(uikitDeclarationsFor(allElements))

  // Init
  write(uiviewInit())

  // View Hierarchy
  write(steviaViewHierarchy(allElements))

  // Layout
  write(steviaLayout(allElements))
  write("")

  // Artboard Background Color
  var red = artboardBackgroundColor.red()
  var green = artboardBackgroundColor.green()
  var blue = artboardBackgroundColor.blue()
  var alpha = artboardBackgroundColor.alpha()
  write("        backgroundColor = UIColor(red: " + red + ", green: " + green + ", blue: " + blue + ", alpha: " + alpha + ")")

  // Style
  write(steviaStyleLabels(labels))
  write(steviaStyleShapes(shapes))
  
  // Buttons
  buttons.map(function(v) {
    var elementName = sanitizeName(v.name)
    v.iterate(function(item) {
      if (item.isText) {
        write("        " + elementName + '.setTitle("' + item.text + '",for: .normal)')
          //Title color
        var color = item.sketchObject.textColor()
        var red = color.red()
        var green = color.green()
        var blue = color.blue()
        var alpha = color.alpha()
        write("        " + elementName + ".setTitleColor(UIColor(red: " + red + ", green: " + green + ", blue: " + blue + ", alpha: " + alpha + "), for: . normal)")

        // Button font
        var fontName = item.sketchObject.fontPostscriptName()
        var fontSize = item.sketchObject.fontSize()
        if (fontName == "SFUIText-Semibold") {
          write("        " + elementName + '.titleLabel?.font = .systemFont(ofSize: ' + fontSize + ", weight: UIFontWeightSemibold)")
        } else if (fontName == "SFUIText-Regular") {
          write("        " + elementName + '.titleLabel?.font = .systemFont(ofSize: ' + fontSize + ")")
        } else {
          write("        " + elementName + '.titleLabel?.font = UIFont(name: "' + fontName + '", size:' + fontSize + ")")
        }
      } else if (item.isShape) {
        var color = item.sketchObject.style().fills()[0].color()
        var red = color.red()
        var green = color.green()
        var blue = color.blue()
        var alpha = color.alpha()
        write("        " + elementName + ".backgroundColor = UIColor(red: " + red + ", green: " + green + ", blue: " + blue + ", alpha: " + alpha + ")")
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

function steviaHeader(viewName) {
  return `
  import Stevia


  class ${viewName} : UIView {
    `
}

function uikitDeclarationsFor(elements) {
  var s = ""
  elements.map(function(e) {
    if (e.isText) {
      s += "    let " + sanitizeName(e.name) + " = UILabel()" + "\n"
    } else if (e.isShape) {
      s += "    let " + sanitizeName(e.name) + " = UIView()" + "\n"
    } else if (e.isGroup) {
      // Only if contains button
      s += "    let " + sanitizeName(e.name) + " = UIButton()" + "\n"
    }
  });
  return s
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

function steviaViewHierarchy(elements) {
  var s = "        // View Hierarchy" + "\n"
  s += "         sv(" + "\n"
  var count = 0
  elements.reverse().map(function(e) {
    if (count == elements.length -1) {
    s += "           " + sanitizeName(e.name) + "\n"
  } else {
    s += "           " + sanitizeName(e.name) + "," + "\n"
  }
    count++
  });
  s += "         )" + "\n"
  return s
}

function steviaLayout(elements) {
  var s = "\n"
  s += "        // Layout" + "\n"
  elements.map(function(e) {
    var elementName = sanitizeName(e.name)
    s += "        " + sanitizeName(e.name) + ".top(" + e.frame.y + ")" + "\n"
    s += "            .left(" + e.frame.x + ")" + "\n"
    s += "            .width(" +  e.frame.width + ")" + "\n"
    s += "            .height(" +  e.frame.height + ")" + "\n"
  });
  return s
}

function steviaStyleLabels(labels) {
  var s = "\n"
  s += "        // Style" + "\n"
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
      s += "        " + elementName + '.font = .systemFont(ofSize: ' + fontSize + ", weight: UIFontWeightSemibold)" + "\n"
    } else if (fontName == "SFUIText-Regular") {
      s += "        " + elementName + '.font = .systemFont(ofSize: ' + fontSize + ")" + "\n"
    } else if (fontName == "SFUIText-Italic") {
      s += "        " + elementName + '.font = .italicSystemFont(ofSize: ' + fontSize + ")" + "\n"
    } else if (fontName == "SFUIText-Light") {
      s += "        " + elementName + '.font = .systemFont(ofSize: ' + fontSize + ", weight: UIFontWeightLight)" + "\n"
    } else if (fontName == "SFUIText-Heavy") {
      s += "        " + elementName + '.font = .systemFont(ofSize: ' + fontSize + ", weight: UIFontWeightHeavy)" + "\n"
    } else if (fontName == "SFUIText-Bold") {
      s += "        " + elementName + '.font = .systemFont(ofSize: ' + fontSize + ", weight: UIFontWeightBold)" + "\n"
    } else if (fontName == "SFUIText-Medium") {
      s += "        " + elementName + '.font = .systemFont(ofSize: ' + fontSize + ", weight: UIFontWeightMedium)" + "\n"
    } else if (fontName == "SFUIText-LightItalic") {
      var fontName = elementName + "Font"
      var fontDescriptorName = elementName + "Descriptor"
      s += "        var " + fontName + ": UIFont = .systemFont(ofSize:" + fontSize + ", weight: UIFontWeightLight)" + "\n"
      s += "        let " + fontDescriptorName + " = " + fontName + ".fontDescriptor.withSymbolicTraits(.traitItalic)" + "\n"
      s += "        " + fontName + " = UIFont(descriptor: " + fontDescriptorName + "!, size: 0)" + "\n"
      s += "        " + elementName + ".font = " + fontName + "\n"
    } else if (fontName == "SFUIText-MediumItalic") {
      var fontName = elementName + "Font"
      var fontDescriptorName = elementName + "Descriptor"
      s += "        var " + fontName + ": UIFont = .systemFont(ofSize:" + fontSize + ", weight: UIFontWeightMedium)" + "\n"
      s += "        let " + fontDescriptorName + " = " + fontName + ".fontDescriptor.withSymbolicTraits(.traitItalic)" + "\n"
      s += "        " + fontName + " = UIFont(descriptor: " + fontDescriptorName + "!, size: 0)" + "\n"
      s += "        " + elementName + ".font = " + fontName + "\n"
    } else if (fontName == "SFUIText-SemiboldItalic") {
      var fontName = elementName + "Font"
      var fontDescriptorName = elementName + "Descriptor"
      s += "        var " + fontName + ": UIFont = .systemFont(ofSize:" + fontSize + ", weight: UIFontWeightSemibold)" + "\n"
      s += "        let " + fontDescriptorName + " = " + fontName + ".fontDescriptor.withSymbolicTraits(.traitItalic)" + "\n"
      s += "        " + fontName + " = UIFont(descriptor: " + fontDescriptorName + "!, size: 0)" + "\n"
      s += "        " + elementName + ".font = " + fontName + "\n"
    } else if (fontName == "SFUIText-BoldItalic") {
      var fontName = elementName + "Font"
      var fontDescriptorName = elementName + "Descriptor"
      s += "        var " + fontName + ": UIFont = .systemFont(ofSize:" + fontSize + ")" + "\n"
      s += "        let " + fontDescriptorName + " = " + fontName + ".fontDescriptor.withSymbolicTraits([.traitItalic, .traitBold])" + "\n"
      s += "        " + fontName + " = UIFont(descriptor: " + fontDescriptorName + "!, size: 0)" + "\n"
      s += "        " + elementName + ".font = " + fontName + "\n"
    }
    else if (fontName == "SFUIText-HeavyItalic") {
      var fontName = elementName + "Font"
      var fontDescriptorName = elementName + "Descriptor"
      s += "        var " + fontName + ": UIFont = .systemFont(ofSize:" + fontSize + ", weight: UIFontWeightHeavy)" + "\n"
      s += "        let " + fontDescriptorName + " = " + fontName + ".fontDescriptor.withSymbolicTraits(.traitItalic)" + "\n"
      s += "        " + fontName + " = UIFont(descriptor: " + fontDescriptorName + "!, size: 0)" + "\n"
      s += "        " + elementName + ".font = "+ fontName + "\n"
    } else {
      s += "        " + elementName + '.font = UIFont(name: "' + fontName + '", size:' + fontSize + ")" + "\n"
    }

    s += "        " + elementName + ".textColor =  UIColor(red: " + red + ", green: " + green + ", blue: " + blue + ", alpha: " + alpha + ")" + "\n"
    if (l.alignment == "center") {
      s += "        " + elementName + ".textAlignment = .center" + "\n"
    }
    s += "        " + elementName + ".numberOfLines = 0" + "\n"
  });
  return s
}

function steviaStyleShapes(shapes) {
  var s = ""
  shapes.map(function(v) {
    var elementName = sanitizeName(v.name)
    var color = v.sketchObject.style().fills()[0].color()
    var red = color.red()
    var green = color.green()
    var blue = color.blue()
    var alpha = color.alpha()
    s += "        " + elementName + ".backgroundColor = UIColor(red: " + red + ", green: " + green + ", blue: " + blue + ", alpha: " + alpha + ")" + "\n"
  });
  return  s
}


function uikitContentForLabels(labels) {
  var s = "\n"
  s += "        // Content" + "\n"
  labels.map(function(l) {
    s += "        " + sanitizeName(l.name) + '.text = "' + l.text + '"' + "\n"
  });
  s += "    }" + "\n"
  s += "}"
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
