function chain(node) {
  if (node.type === 'CallExpression') {
    return node;
  }
  return chain(node.parent);
}

export default function (context) {
  function UncaughtInPromise(node) {
    context.report({
      node,
      message: "Add .catch() to avoid error: 'Uncaught (in promise)'",
      fix(fixer) {
        return fixer.insertTextAfter(chain(node), '.catch(()=>{})');
      },
    });
  }
  return {
    'AwaitExpression > CallExpression > Identifier': UncaughtInPromise,
    "AwaitExpression > CallExpression > MemberExpression > Identifier[name!='catch']":
      UncaughtInPromise,
  };
}

function chain(node) {
  if (node.type === 'CallExpression') {
    return node;
  }
  return chain(node.parent);
}
