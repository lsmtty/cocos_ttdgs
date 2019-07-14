module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: false,
        node: true,
        es6: true
    },
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    extends: 'standard',
    // required to lint *.vue files
    plugins: [
        'html'
    ],
    // add your custom rules here
    'rules': {
        // allow paren-less arrow functions
        'arrow-parens': 0,
        'semi': ["error", "never", { "beforeStatementContinuationChars": "any"}],
        // allow async-await
        'generator-star-spacing': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        'space-before-function-paren': 0,
        'eqeqeq': 0,
        'prefer-promise-reject-errors': 0,
        'no-proto': 0,
        // 强制使用骆驼拼写法命名约定
        'camelcase': 0,
        // 要求回调函数中有容错处理
        'handle-callback-err': 0,
        // callback(true)或callback(false)在ES6里是不被允许的
        'no-callback-literal': 0,
        'standard/no-callback-literal': 0,
        'no-useless-call': 0,
        // // 禁止扩展原生类型 
        'no-extend-native': 0,
        // 要求每个块有一个 let 声明
        'let': 'always',
        //	禁止不必要的 .call() 和 .apply()
        'hideMask': 0,
  
        // 强制每一行中所允许的最大语句数量 1句
        // 'max-statements-per-line': ["error", {"max": 1}],
  
        // 'max-depth': ["error", {"max": 3}],
  
        // 数组元素超过四个要求换行
        'array-element-newline':['error', { "multiline": true, "minItems": 4 }],
        // 在数组开括号后和闭括号前强制换行
        'array-bracket-newline': 0,
        // 强制数组方括号中使用一致的空格
        'array-bracket-spacing': 1,
        // 要求正则表达式被括号括起来
        'wrap-regex': 1,
        'new-cap': 0
    },
    globals: {
        wx: true,
        Toast: true,
        cc: true
    }
  }