const fs = require('fs');
const path = require('path')
 
class DependencyAnalysisPlugin {
    constructor(options = {}) {
        this.options = options
        this.entry = options.entry || 'src' // 入口
        this.include = options.include || '' // 包含哪些文件'.vue|.js'
        this.exclude = options.exclude || '' // 排除哪些文件夹 ['src/assets', 'src/views']
        this.isDelete = options.isDelete || false // 是否主动删除文件
        this.originFile = [] // node读取的源文件目录 处理过include及exclude 后的数据 最全的数据
        this.dependenciesFile = [] // webpack依赖数据 处理过include及exclude 后的数据 依赖数据
        this.noUseFile = [] // 最全的数据 减去 依赖数据  可删除的数据
        this.init() // 初始化
    }
 
    apply(compiler) {
        compiler.hooks.done.tapAsync("DependencyAnalysisPlugin", (factory, cb) => {
            // 获取依赖资产
            let curFile = []
            factory.compilation.fileDependencies.forEach(item => {
                curFile.push(item)
            })
            // 排除node_modules 与 确认入口文件
            curFile = curFile.filter(item => {
                if (item.indexOf('node_modules') == -1 && item.indexOf(this.resolve(this.entry)) > -1) {
                    return item
                }
            })
            // 处理include规则
            const includeFile = this.includeHandle(curFile)
            // 处理exclude规则
            const excludeFile = this.excludeHandle(includeFile)
            this.dependenciesFile = excludeFile
            // 从 originFile 及 dependenciesFile 数据中分析出 未被使用的数据
            this.originFile.forEach(item => {
                if (this.dependenciesFile.findIndex(el => el == item) == -1) {
                    this.noUseFile.push(item)
                }
            })
            // 处理资源 写入文件
            this.writeDirPathHandle()
            // console.log('this.originFile-------', this.originFile)
            // console.log('this.dependenciesFile-------', this.dependenciesFile)
            // console.log('this.noUseFile-------', this.noUseFile)
            // console.log('this.originFile-------', this.originFile.length)
            // console.log('this.dependenciesFile-------', this.dependenciesFile.length)
            // console.log('this.noUseFile-------', this.noUseFile.length)
            cb()
        });
    }
 
    // 初始化
    init() {
        console.log('[dependency] ##启动依赖分析功能')
        console.log('[dependency] ##是否自动删除文件', this.isDelete)
        // 读取指定node文件
        this.readOriginFile()
    }
 
    // 转换路径
    resolve(pathname = '') {
        return path.join(path.resolve('./'), pathname)
    }
 
    // 读取源文件目录
    readOriginFile() {
        const files = this.readFiles(this.entry)
        // 处理include规则
        const includeFile = this.includeHandle(files)
        // 处理exclude规则
        const excludeFile = this.excludeHandle(includeFile)
        this.originFile = excludeFile
    }
 
    // 读取指定目录文件
    readFiles(path) {
        let allFile = []
        const curPath = this.resolve(path)
        const files = fs.readdirSync(curPath);
        for (const file of files) {
            const obj = fs.statSync(this.resolve(`${path}/${file}`));
            if (obj.isDirectory()) {
                allFile = [...allFile, ...this.readFiles(`${path}/${file}`)];
            } else {
                // 排除 .gitkeep 等隐藏文件
                const isHideFile = new RegExp(/^\./).test(file)
                // 排除 md文件
                const isMdFile = new RegExp(/\.md$/).test(file)
                if (!isHideFile && !isMdFile) {
                    allFile.push(this.resolve(`${path}/${file}`));
                }
            }
        }
        return allFile
    }
 
    // 处理规则
    includeHandle(list) {
        if (!this.include) {
            return list
        }
        // 指定类型的文件
        const includeArr = this.include.split('|')
        const filterFile = list.filter(item => {
            const index = includeArr.findIndex(el => item.indexOf(el) > -1)
            if (index > -1) {
                return item
            }
        })
        return filterFile
    }
 
    // 处理规则
    excludeHandle(list) {
        if (!this.exclude) {
            return list
        }
        // 过滤指定文件夹
        const excludeList = []
        this.exclude.forEach(item => {
            excludeList.push(this.resolve(item))
        })
        const filterFile = list.filter(item => {
            const index = excludeList.findIndex(el => item.indexOf(el) > -1)
            if (index == -1) {
                return item
            }
        })
        return filterFile
    }
 
    // 写入文件
    writeDirPathHandle() {
        let content = `所有文件-length[${this.originFile.length}]、依赖文件-length[${this.dependenciesFile.length}]、无用文件-length[${this.noUseFile.length}]`
        content += `\r\n##########所有文件-length[${this.originFile.length}]##########\r\n${this.originFile.join('\n')}\r\n`;
        content += `\r\n##########依赖文件-length[${this.dependenciesFile.length}]##########\r\n${this.dependenciesFile.join('\n')}\r\n`;
        content += `\r\n##########无用文件-length[${this.noUseFile.length}]##########\r\n${this.noUseFile.join('\n')}\r\n`;
        fs.writeFile('dependency.txt', content, (err) => {
            if (err) {
                console.error(err)
                return
            }
            console.log('[dependency] ## 文件已写入dependency.txt')
            // 判断是否执行删除
            if (this.isDelete) {
                this.deleteFileHandle()
            }
        })
    }
 
    // 删除文件
    deleteFileHandle() {
        this.noUseFile.forEach(item => {
            fs.unlink(item, (err) => {
                if (err) throw err
                console.log(`[dependency] ## 已删除文件：${item}`)
            })
        })
    }
}
module.exports = DependencyAnalysisPlugin;