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

from DOM::Element element, DataFlow::Node source
where
  // Find DOM operations that could be unsafe
  exists(CallExpr call |
    // innerHTML assignments
    call.getCalleeName() = "innerHTML" or
    // document.write calls
    call.getCalleeName() = "write" or
    // eval-like functions
    call.getCalleeName() = "eval" or
    // Dynamic script creation
    (call.getCalleeName() = "createElement" and
     call.getArgument(0).getStringValue() = "script")
  ) and
  
  // Source comes from user input or external data
  (
    source.asExpr() instanceof CallExpr and
    (
      source.asExpr().(CallExpr).getCalleeName() = "getElementById" or
      source.asExpr().(CallExpr).getCalleeName() = "querySelector" or
      source.asExpr().(CallExpr).getCalleeName() = "querySelectorAll" or
      // Form data
      source.asExpr().(CallExpr).getCalleeName() = "FormData" or
      // URL parameters
      source.asExpr().(CallExpr).getCalleeName().matches(".*search.*") or
      source.asExpr().(CallExpr).getCalleeName().matches(".*query.*")
    )
  ) and
  
  element = call.getReceiver()
select element, "Potential XSS vulnerability: unsafe DOM manipulation with user-controlled data"