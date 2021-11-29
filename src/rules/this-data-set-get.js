export default function (context) {
    return {
      "AssignmentExpression[operator='='] > MemberExpression > MemberExpression": node => {
        if (node.object.type === 'ThisExpression') {
          if (node.property.name === 'data') {
            context.report({
              node,
              message: '直接修改data值不会触发更新，必须通过this.setData()接口执行',
            });
          }
        }
      },
      // set(for store)
      "AssignmentExpression[operator='='] > MemberExpression": node => {
        const recursion = function (_node) {
          if (_node.object.type === 'MemberExpression') {
            recursion(_node.object);
          } else if (_node.object.type === 'ThisExpression') {
            context.report({
              node: _node,
              message: '这样不会触发界面更新，必须设置为一个新的值 this.xxx = yyy',
            });
          }
        };
  
        if (node.object.type === 'MemberExpression') {
          recursion(node);
        } else {
          // store中不用
          context.report({
            node,
            message: '如果要触发界面更新，请使用setData()接口',
          });
        }
      },
      // get
      // 表达式
      "ExpressionStatement > MemberExpression[object.type = 'ThisExpression' ] > Identifier":
        node => {
          if (node.name != 'data' && node.name != 'setData') {
            context.report({
              node,
              message: `可能需要从this.data中获取${node.name}`,
              fix:function(fixer) {
                return fixer; // TODO
              }
            });
          }
        },
      // 作为参数
      CallExpression: node => {
        try {
          node.arguments.forEach(a => {
            if (a.object.type === 'ThisExpression') {
              if (a.property.name != 'data') {
                context.report({
                  node: a,
                  message: `可能需要从this.data中获取${a.property.name}`,
                });
              }
            }
          });
        } catch (err) {}
      },
    };
  }
  