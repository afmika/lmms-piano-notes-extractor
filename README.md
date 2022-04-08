# lmmp-project-piano-roll-extractor
LMMS Project Piano roll extractor

## Usage

## Generating the XML content of your LMMS project
```
installation_folder/of/lmms --dump your_project_file.mmpz > your_project_xml.mmp
```

## LMMP TOOL
Convert all notes of a `pattern` section from your project file to piano keys
```bash
node lmmp-tool your_xml_project [--coord|--json]
```

## Example
```bash
 node lmmp-tool sandbox/cdefgab-sample.mmp --json
```