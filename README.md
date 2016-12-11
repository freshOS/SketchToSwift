# SketchToSwift

![Demo](https://raw.githubusercontent.com/s4cha/Localize/master/demo.gif)

## Why
Because **integrating views** form Sketch has **no added value**, its just back and forth translating sketch values to swift code. There must be a way to automate this time costly and low added value labor.

## How
By **generating the swift UIKit code** from a Sketch Artboard. We can save hours of time \o/

## What
A **Sketch plugin** with a simple shortcut that generates basic Swift code form wich you can kickstart developing your view.


## About

This is a proof of concept that we can generate UIVIew swift code from Sketch Artboards.


Very early and in development
Generate Swift Code from UIKit Artboards

Sketch plugin for generating native UIKit Stevia code

Yes this will never be perfect (huh wait for AI!), because we all have ouur coding styles etc. But this is not the goal anyway, the goal is to kickstart view dev and save 80% of integration time. Then you are free to change the code as you like :)


## Usage
- Install (double click) plugin
- Select Artboard
- `cmd` + `alt` + `k`
- Paste swift Uikit UIView subclass in Xcode \o/

## Get the best out of it

Here are some rules you can follow to get the best export possible :

- Name your Artboard proprely:
For instance an Artboard named "Profile" will generate `class ProfileView: UIView `
- Resize Artboard for your iPhone size (ex: we usually use 375Width for iPhone 7)
By resizing the artboard with the scale tool, you'll make sure the script will generate the good font sizes etc.
- Name your sketch layers right in order to get sexy variable names
- After the scale, you probably have float margins and font size. Making sure these are clean ext 16p instead of 16,01543 will generate cleaner code :)
- The same Applies to margins and sizes in general
- Flatten the view hierarchy, extract the items inside groups and bring them to the top level.
- Order them (usually from the to to the bottom), the generated code will keep the view hierarchy order.


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
