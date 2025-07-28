/**
 * @name Content Security Policy violations
 * @description Detects code patterns that may violate Content Security Policy
 * @kind problem
 * @problem.severity error
 * @security-severity 7.0
 * @precision high
 * @id sealfie/csp-violations
 * @tags security
 *       external/cwe/cwe-79
 *       external/cwe/cwe-94
 */

import javascript

predicate isCSPViolatingCall(CallExpr call) {
  // eval() and Function() constructor
  call.getCalleeName() = "eval" or
  call.getCalleeName() = "Function" or
  
  // setTimeout/setInterval with string argument
  (call.getCalleeName() = "setTimeout" or call.getCalleeName() = "setInterval") and
  call.getArgument(0) instanceof StringLiteral or
  
  // Dynamic script injection
  exists(AssignExpr assign |
    assign.getLhs().(PropAccess).getPropertyName() = "innerHTML" and
    assign.getRhs().toString().matches(".*<script.*") and
    assign = call.getAnArgument().asExpr()
  ) or
  
  // document.write with script tags
  call.getCalleeName() = "write" and
  call.getArgument(0).toString().matches(".*<script.*")
}

predicate isInlineEventHandler(Expr expr) {
  exists(PropAccess prop |
    prop = expr and
    prop.getPropertyName().matches("on.*") and
    (prop.getPropertyName() = "onclick" or
     prop.getPropertyName() = "onload" or
     prop.getPropertyName() = "onerror" or
     prop.getPropertyName() = "onsubmit")
  )
}

predicate isDataURI(StringLiteral str) {
  str.getValue().matches("data:*")
}

from Expr violation, string violationType
where
  (
    violation instanceof CallExpr and
    isCSPViolatingCall(violation) and
    violationType = "unsafe-eval or unsafe-inline code execution"
  ) or
  (
    isInlineEventHandler(violation) and
    violationType = "inline event handler (violates CSP)"
  ) or
  (
    violation instanceof StringLiteral and
    isDataURI(violation) and
    violationType = "data: URI usage (may violate CSP)"
  )
select violation, "Potential CSP violation: " + violationType