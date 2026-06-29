'****************************************
' Declaring and Setting Variables
'****************************************
Dim fso, folder, files, outputFile
Dim strPath, outputFilename, cssImagePath, foundHoverFileName, cssWriteStr

strPath = "img"
outputFilename = "css/uikit-icons.css"
cssImagePath = "../img/"

'****************************************
' Support Functions
'****************************************
'icon-add-package-hover.svg
Function MakeIconCssClassString(fileName, hoverFileName)
    Dim ret, className
    className = Left(fileName, InStr(fileName, ".") - 1)
    ret = vbCrLf & "." & classname & " {" & vbCrLf & _
        "    background-image: url(""" & cssImagePath  & fileName & """);" & vbCrLf & _
        "}"
    if (hoverFileName <> "") then
        ret = ret & vbCrLf & vbCrLf & "." & classname & ":hover {" & vbCrLf & _
        "    background-image: url(""" & cssImagePath & hoverFileName & """);" & vbCrLf & _
        "}"
    end if
   MakeIconCssClassString = ret
End Function

'****************************************
' Script Main
'****************************************
' Create a FileSystemObject  
Set fso = CreateObject("Scripting.FileSystemObject")
Set folder = fso.GetFolder(strPath)
Set files = folder.Files
 
' Create CSV file to output test data
Set outputFile = fso.CreateTextFile(outputFilename, True)
outputFile.WriteLine("/* UPS Digital Transformation Icons with Hover */")

' Loop through each file  
For each item In files
    if (LCase(Right(item.Name, 3)) = "svg" And InStr(LCase(item.Name), "-hover.svg") = 0) then
        foundHoverFileName = ""
        if (InStr(LCase(item.Name), "-white.") > 0) then
            foundHoverFileName = Left(item.Name, Instr(LCase(item.Name), "-white.")) + "hover.svg"
        elseif (InStr(LCase(item.Name), "-brown.") > 0) then
            foundHoverFileName = Left(item.Name, Instr(LCase(item.Name), "-brown.")) + "hover.svg"
        else
            foundHoverFileName = Left(item.Name, Instr(LCase(item.Name), ".svg") - 1) + "-hover.svg"
        end if

        if (not fso.FileExists(strPath & "\" & foundHoverFileName)) then
            foundHoverFileName = ""
        end if

        cssWriteStr = MakeIconCssClassString(item.name, foundHoverFileName)
        outputFile.WriteLine(cssWriteStr)
    end if
Next
 
' Close text file
outputFile.Close

WScript.Echo("File " & outputFilename & " Created.")