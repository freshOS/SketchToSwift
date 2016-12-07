# SketchToSwift


This is a proof of concept that we can generate UIVIew swift code from Sketch Artboards.


Very early and in development
Generate Swift Code from UIKit Artboards

Sketch plugin for generating native UIKit Stevia code


## Usage
- Install (double click) plugin
- Select Artboard
- cmd + alt + k
- Paste swift Uikit UIView subclass in Xcode \o/


## More

## Improvements

### Fonts
- Detect SF fonts and use `.systemFont(of:x, weight:UIFontWeightX)` instead of font name

### Text
- Detect Text in style caps -> apply uppercased
- Detect character spacing in fonts -> AttributedString
- Detech line spacing -> AttributedString
- Detect Multiline (contains \n) -> Append \n and set label to mutiline
- Detect text alignment all cases
- Multicolor -> Generate AttributedString

### Colors
- Support Artboart BG color -> view bg color
- Detect native and write ex: . red . white. black etc
- UIColors replace by custom ones?
- UIColors oftenThe same refactor in one variable

### Radius
- Detect UIButton corner Radius

### Borders
- Button border color
- Button border radius

### Sketch Groups
- groups -> greate UIViewSubclasses?
- UIButton set title belongs in content section

### layout
- Detect fillscontainer and do not use width and height but right and bottom laike a human would do
- Implement relative layout
- more visually to the right -> align on right rather tahn left , more natural

### Export
- Handle single Element Export

### Stevia
- Generate Stevia code plugin dropdown
- Shortcut !

### UITableViewCell
- Artboard name Suffixed by `Cell` -> UITableViewCell subclass

## Images
- Find a wa to detect images and create UIImageView instead

### Groups
- Think about how to handle them proprely

## Issues
Have a layout that breaks the plugin?
Send it to sachadso@gmail.com for review + open Issue
