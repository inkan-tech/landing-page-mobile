/**
 * @name Third-party script loading detection
 * @description Detects loading of external scripts that could pose security risks
 * @kind problem
 * @problem.severity recommendation
 * @precision high
 * @id sealfie/third-party-scripts
 * @tags security
 *       supply-chain
 */

import javascript

predicate isExternalScript(CallExpr call) {
  // Script element creation with external src
  exists(AssignExpr assign |
    assign.getLhs().(PropAccess).getPropertyName() = "src" and
    assign.getRhs() instanceof StringLiteral and
    assign.getRhs().(StringLiteral).getValue().matches("http*") and
    not assign.getRhs().(StringLiteral).getValue().matches("*sealf.ie*") and
    not assign.getRhs().(StringLiteral).getValue().matches("*inkan.link*")
  ) or
  
  // Dynamic script loading
  call.getCalleeName() = "createElement" and
  call.getArgument(0).(StringLiteral).getValue() = "script"
}

from CallExpr call
where isExternalScript(call)
select call, "External script loading detected - verify trustworthiness and integrity"