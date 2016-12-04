function onRun(context) {

var lines = []


function write(text) {
  lines.push(text)
}

var sketch = context.api()
var document = sketch.selectedDocument
var selection = document.selectedLayers
var labels = []
var shapes = []

selection.iterate(function(item) {
    if (item.isArtboard) {
        item.iterate(function(element) {
            if (element.isText) {
                labels.push(element)
            } else if (element.isShape) {
                shapes.push(element)
                //log(element.name)
                //log(element.sketchObject.style().fills()[0].color())
                //log(element.frame)
            }
        })
    }
});


/// GENERATED STEVIA CODE
write("")
write("import UIKit")
write("")
write("")
write("class UIKitView: UIView {")
write("")
labels.map(function(l) {
    write("    let " + sanitizeName(l.name) + " = UILabel()")
});
shapes.map(function(v) {
    write("    let " + sanitizeName(v.name) + " = UIView()")
});
write("")

write("    convenience init() {")
write("        self.init(frame:CGRect.zero)")
write("")
// View Hierarchy


labels.map(function(l) {
  write("        " + sanitizeName(l.name) + ".translatesAutoresizingMaskIntoConstraints = false")
});
shapes.map(function(v) {
  write("        " + sanitizeName(v.name) + ".translatesAutoresizingMaskIntoConstraints = false")
});
  write("")
labels.map(function(l) {
  write("        addSubview(" + sanitizeName(l.name) + ")")
});
shapes.map(function(v) {
  write("        addSubview(" + sanitizeName(v.name) + ")")
});


write("")
// Layout
write("        // Layout")
labels.map(function(l) {

// Absolute positioning
write("        " + sanitizeName(l.name) + ".top(" + l.frame.y + ")")
write("            .left(" + l.frame.x + ")")
write("            .right(" +  (375-(l.frame.x + l.frame.width)) + ")")

    //if (l.alignment == "center")  {
       // log("        " + lowerCaseFirstLetter(l.name) + ".centerInContainer()")
    //}
});

  shapes.map(function(v) {
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
    //if (l.alignment == "center")  {
       // log("        " + lowerCaseFirstLetter(l.name) + ".centerInContainer()")
    //}
});
write("")
// Style
write("        // Style")
write("        backgroundColor = .white")
labels.map(function(l) {

  var elementName = sanitizeName(l.name)


var red = l.sketchObject.textColor().red()
var green = l.sketchObject.textColor().green()
var blue = l.sketchObject.textColor().blue()
var alpha = l.sketchObject.textColor().alpha()
    write("        " + elementName + '.font = UIFont(name: "' + l.sketchObject.fontPostscriptName() + '", size:' + l.sketchObject.fontSize() + ")" )
    write("        " + elementName + ".textColor =  UIColor(red: " + red + ", green: " + green + ", blue: " + blue + ", alpha: " + alpha + ")")
    if (l.alignment == "center") {
        write("        " + elementName + ".textAlignment = .center")
    }
});
shapes.map(function(v) {
var elementName = sanitizeName(v.name)
var color = v.sketchObject.style().fills()[0].color()
var red = color.red()
var green = color.green()
var blue = color.blue()
var alpha = color.alpha()
    write("        " + elementName + ".backgroundColor =  UIColor(red: " + red + ", green: " + green + ", blue: " + blue + ", alpha: " + alpha + ")")
});
// Content
write("")
write("        // Content")
labels.map(function(l) {
    write("        " + sanitizeName(l.name) + '.text = "' + l.text + '"')
});

write("    }")
write("}")

function lowerCaseFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}




var fullText = ""
lines.forEach(function(line) {
    fullText += line + "\n"
})

log(fullText)

copyText(fullText)


function copyText(text) {
  var pasteBoard = [NSPasteboard generalPasteboard];
  [pasteBoard declareTypes:[NSArray arrayWithObject:NSPasteboardTypeString] owner:nil];
  [pasteBoard setString:text forType:NSPasteboardTypeString];
}

function sanitizeName(str) {
   return lowerCaseFirstLetter(removeSpaces(str))
}

function removeSpaces(str) {
   return str.replace(/\s+/g, '');
}

function lowerCaseFirstLetter(str) {
   return str.charAt(0).toLowerCase() + str.slice(1)
}

};
