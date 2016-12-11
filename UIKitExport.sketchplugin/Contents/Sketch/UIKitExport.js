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
  write("        // Layout")
  allElements.map(function(v) {
    var elementName = sanitizeName(v.name)

    // Top
    write("        addConstraint(")
    write("            NSLayoutConstraint(item: " + elementName + ",")
    write("                               attribute: .top,")
    write("                               relatedBy: .equal,")
    write("                               toItem: self,")
    write("                               attribute: .top,")
    write("                               multiplier: 1,")
    write("                               constant: " + v.frame.y + ")")
    write("         )")

    // Left
    write("        addConstraint(")
    write("            NSLayoutConstraint(item: " + elementName + ",")
    write("                               attribute: .left,")
    write("                               relatedBy: .equal,")
    write("                               toItem: self,")
    write("                               attribute: .left,")
    write("                               multiplier: 1,")
    write("                               constant: " + v.frame.x + ")")
    write("         )")

    // Width
    write("        addConstraint(")
    write("            NSLayoutConstraint(item: " + elementName + ",")
    write("                               attribute: .width,")
    write("                               relatedBy: .equal,")
    write("                               toItem: nil,")
    write("                               attribute: .notAnAttribute,")
    write("                               multiplier: 1,")
    write("                               constant: " + v.frame.width + ")")
    write("         )")

    // Height
    write("        addConstraint(")
    write("            NSLayoutConstraint(item: " + elementName + ",")
    write("                               attribute: .height,")
    write("                               relatedBy: .equal,")
    write("                               toItem: nil,")
    write("                               attribute: .notAnAttribute,")
    write("                               multiplier: 1,")
    write("                               constant: " + v.frame.height + ")")
    write("         )")
  });
  write("")

  // Style
  write("        // Style")

  // Artboard Background Color
  var red = artboardBackgroundColor.red()
  var green = artboardBackgroundColor.green()
  var blue = artboardBackgroundColor.blue()
  var alpha = artboardBackgroundColor.alpha()
  write("        backgroundColor = UIColor(red: " + red + ", green: " + green + ", blue: " + blue + ", alpha: " + alpha + ")")

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
      write("        " + elementName + '.font = .systemFont(ofSize: ' + fontSize + ", weight: UIFontWeightSemibold)")
    } else if (fontName == "SFUIText-Regular") {
      write("        " + elementName + '.font = .systemFont(ofSize: ' + fontSize + ")")
    } else if (fontName == "SFUIText-Italic") {
      write("        " + elementName + '.font = .italicSystemFont(ofSize: ' + fontSize + ")")
    } else if (fontName == "SFUIText-Light") {
      write("        " + elementName + '.font = .systemFont(ofSize: ' + fontSize + ", weight: UIFontWeightLight)")
    } else if (fontName == "SFUIText-Heavy") {
      write("        " + elementName + '.font = .systemFont(ofSize: ' + fontSize + ", weight: UIFontWeightHeavy)")
    } else if (fontName == "SFUIText-Bold") {
      write("        " + elementName + '.font = .systemFont(ofSize: ' + fontSize + ", weight: UIFontWeightBold)")
    } else if (fontName == "SFUIText-Medium") {
      write("        " + elementName + '.font = .systemFont(ofSize: ' + fontSize + ", weight: UIFontWeightMedium)")
    } else if (fontName == "SFUIText-LightItalic") {
      var fontName = elementName + "Font"
      var fontDescriptorName = elementName + "Descriptor"
      write("        var " + fontName + ": UIFont = .systemFont(ofSize:" + fontSize + ", weight: UIFontWeightLight)")
      write("        let " + fontDescriptorName + " = " + fontName + ".fontDescriptor.withSymbolicTraits(.traitItalic)")
      write("        " + fontName + " = UIFont(descriptor: " + fontDescriptorName + "!, size: 0)")
      write("        " + elementName + ".font = " + fontName)
    } else if (fontName == "SFUIText-MediumItalic") {
          var fontName = elementName + "Font"
          var fontDescriptorName = elementName + "Descriptor"
          write("        var " + fontName + ": UIFont = .systemFont(ofSize:" + fontSize + ", weight: UIFontWeightMedium)")
          write("        let " + fontDescriptorName + " = " + fontName + ".fontDescriptor.withSymbolicTraits(.traitItalic)")
          write("        " + fontName + " = UIFont(descriptor: " + fontDescriptorName + "!, size: 0)")
          write("        " + elementName + ".font = " + fontName)
    } else if (fontName == "SFUIText-SemiboldItalic") {
          var fontName = elementName + "Font"
          var fontDescriptorName = elementName + "Descriptor"
          write("        var " + fontName + ": UIFont = .systemFont(ofSize:" + fontSize + ", weight: UIFontWeightSemibold)")
          write("        let " + fontDescriptorName + " = " + fontName + ".fontDescriptor.withSymbolicTraits(.traitItalic)")
          write("        " + fontName + " = UIFont(descriptor: " + fontDescriptorName + "!, size: 0)")
          write("        " + elementName + ".font = " + fontName)
    } else if (fontName == "SFUIText-BoldItalic") {
          var fontName = elementName + "Font"
          var fontDescriptorName = elementName + "Descriptor"
          write("        var " + fontName + ": UIFont = .systemFont(ofSize:" + fontSize + ")")
          write("        let " + fontDescriptorName + " = " + fontName + ".fontDescriptor.withSymbolicTraits([.traitItalic, .traitBold])")
          write("        " + fontName + " = UIFont(descriptor: " + fontDescriptorName + "!, size: 0)")
          write("        " + elementName + ".font = " + fontName)
    }
    else if (fontName == "SFUIText-HeavyItalic") {
          var fontName = elementName + "Font"
          var fontDescriptorName = elementName + "Descriptor"
          write("        var " + fontName + ": UIFont = .systemFont(ofSize:" + fontSize + ", weight: UIFontWeightHeavy)")
          write("        let " + fontDescriptorName + " = " + fontName + ".fontDescriptor.withSymbolicTraits(.traitItalic)")
          write("        " + fontName + " = UIFont(descriptor: " + fontDescriptorName + "!, size: 0)")
          write("        " + elementName + ".font = "+ fontName)
    } else {
      write("        " + elementName + '.font = UIFont(name: "' + fontName + '", size:' + fontSize + ")")
    }

    write("        " + elementName + ".textColor =  UIColor(red: " + red + ", green: " + green + ", blue: " + blue + ", alpha: " + alpha + ")")
    if (l.alignment == "center") {
      write("        " + elementName + ".textAlignment = .center")
    }
    write("        " + elementName + ".numberOfLines = 0")
    write("")
  });
  shapes.map(function(v) {
    var elementName = sanitizeName(v.name)
    var color = v.sketchObject.style().fills()[0].color()
    var red = color.red()
    var green = color.green()
    var blue = color.blue()
    var alpha = color.alpha()
    write("        " + elementName + ".backgroundColor = UIColor(red: " + red + ", green: " + green + ", blue: " + blue + ", alpha: " + alpha + ")")
    write("")
  });


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


function uikitHeader(viewName) {
  return "import UIKit" + "\n" +
    "\n" +
    "\n" +
    "class " + viewName + " : UIView {" +
    "\n"
}

function uiviewInit() {
  return "    convenience init() {" + "\n" +
    "        self.init(frame:CGRect.zero)"
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

function uikitViewHierarchy(elements) {
  var s = "        // View Hierarchy" + "\n"
  elements.map(function(e) {
    s += "        " + sanitizeName(e.name) + ".translatesAutoresizingMaskIntoConstraints = false" + "\n"
  });
  elements.reverse().map(function(e) {
    s += "        addSubview(" + sanitizeName(e.name) + ")" + "\n"
  });
  return s
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
