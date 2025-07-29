/**
 * @name Unsafe DOM manipulation in landing page
 * @description Detects potential XSS vulnerabilities through unsafe DOM manipulation
 * @kind problem
 * @problem.severity warning
 * @security-severity 7.5
 * @precision medium
 * @id sealfie/unsafe-dom-manipulation
 * @tags security
 *       external/cwe/cwe-079
 *       external/cwe/cwe-094
 */

import javascript

from DOM::Element element, DataFlow::Node source, CallExpr call
where
  (
    call.getCalleeName() = "innerHTML" or
    call.getCalleeName() = "write" or
    call.getCalleeName() = "eval" or
    (call.getCalleeName() = "createElement" and call.getArgument(0).getStringValue() = "script")
  ) and
  (
    source.asExpr() instanceof CallExpr and
    (
      source.asExpr().(CallExpr).getCalleeName() = "getElementById" or
      source.asExpr().(CallExpr).getCalleeName() = "querySelector" or
      source.asExpr().(CallExpr).getCalleeName() = "querySelectorAll" or
      source.asExpr().(CallExpr).getCalleeName() = "FormData" or
      source.asExpr().(CallExpr).getCalleeName().matches(".*search.*") or
      source.asExpr().(CallExpr).getCalleeName().matches(".*query.*")
    )
  ) and
  element = call.getReceiver()
select element, "Potential XSS vulnerability: unsafe DOM manipulation with user-controlled data"
