// TODO: 未来使用babel自动补充.catch后缀

export default function (context) {
    function UncaughtInPromise(node) {
      context.report({
        node,
        message: "Add .catch() to avoid error: 'Uncaught (in promise)'",
        // TODO: fix
      });
    }
    return {
      'AwaitExpression > CallExpression > Identifier': UncaughtInPromise,
      "AwaitExpression > CallExpression > MemberExpression > Identifier[name='then']":
        UncaughtInPromise,
    };
  }
  