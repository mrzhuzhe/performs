
fs = require 'fs'
path = require 'path'
shjs = require 'shelljs'

oldVersion = require('../package.json').version

newVersion = process.env.version

if not newVersion?
  console.log '缺少 `version`! 使用 version=[版本号] 变量运行脚本'
  process.exit 1
else
  console.log '这个脚本会粗略替换版本号, 确认了解版本替换的需求'

srcFiles = shjs.ls '-R', ['src/**/*.js']
readmeFile = ['README.md', 'package.json']

srcFiles.concat(readmeFile).forEach (file) ->
  content = fs.readFileSync file, 'utf8'
  reg = new RegExp oldVersion.replace(/\./g, '\\.'), 'g'
  newContent = content.replace reg, newVersion
  if newContent isnt content
    console.log 'Replacing file:', file
  fs.writeFileSync file, newContent
