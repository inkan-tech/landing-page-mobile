/**
 * @name Analytics data exposure
 * @description Detects potential PII or sensitive data being sent to analytics services
 * @kind problem
 * @problem.severity error
 * @security-severity 8.0
 * @precision high
 * @id sealfie/analytics-data-exposure
 * @tags security
 *       external/cwe/cwe-200
 *       privacy
 */

import javascript

predicate isSensitiveProperty(string prop) {
  prop.regexpMatch("(?i).*(password|email|phone|ssn|credit|card|token|key|secret|private).*")
}

predicate isAnalyticsCall(CallExpr call) {
  exists(string method |
    method = call.getCalleeName() |
    // Matomo/Piwik tracking calls
    method = "push" and call.getReceiver().toString().matches(".*_paq.*") or
    // Google Analytics calls
    method = "gtag" or method = "ga" or
    // Generic tracking calls
    method.matches(".*track.*") or method.matches(".*send.*") or
    // Custom analytics push
    method = "push" and call.getReceiver().toString().matches(".*analytics.*")
  )
}

from CallExpr call, Expr arg, string propName
where
  isAnalyticsCall(call) and
  arg = call.getAnArgument() and
  (
    // Direct property access
    (arg instanceof PropAccess and arg.(PropAccess).getPropertyName() = propName) or
    // String literals containing sensitive keywords  
    (arg instanceof StringLiteral and arg.(StringLiteral).getValue().regexpMatch("(?i).*(" + propName + ").*")) or
    // Variable names containing sensitive keywords
    (arg instanceof VarAccess and arg.(VarAccess).getName().regexpMatch("(?i).*(" + propName + ").*"))
  ) and
  isSensitiveProperty(propName)
select call, "Potential PII or sensitive data '" + arg.toString() + "' being sent to analytics service"