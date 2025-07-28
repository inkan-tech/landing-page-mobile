/**
 * @name Missing input validation in contact forms
 * @description Detects contact form inputs that lack proper validation
 * @kind problem
 * @problem.severity warning
 * @security-severity 6.0
 * @precision medium
 * @id sealfie/missing-input-validation
 * @tags security
 *       external/cwe/cwe-20
 *       external/cwe/cwe-79
 */

import javascript

predicate isFormInputAccess(DataFlow::Node node) {
  exists(CallExpr call |
    call = node.asExpr() and
    (
      // FormData access
      call.getCalleeName() = "get" and
      call.getReceiver().getType().toString().matches(".*FormData.*") or
      // Direct form element access
      call.getCalleeName() = "getElementById" or
      call.getCalleeName() = "querySelector" and
      call.getArgument(0).toString().matches(".*input.*") or
      // Form submission events
      call.getCalleeName() = "addEventListener" and
      call.getArgument(0).toString().matches(".*submit.*")
    )
  )
}

predicate hasValidation(DataFlow::Node input) {
  exists(CallExpr validationCall |
    // Check for common validation patterns
    validationCall.getCalleeName().matches(".*validate.*") or
    validationCall.getCalleeName().matches(".*sanitize.*") or
    validationCall.getCalleeName().matches(".*escape.*") or
    // RegExp validation
    validationCall.getCalleeName() = "test" or
    validationCall.getCalleeName() = "match" or
    // Length checks
    exists(PropAccess lengthCheck |
      lengthCheck.getPropertyName() = "length" and
      lengthCheck.getBase().toString() = input.toString()
    ) or
    // Type checks
    validationCall.getCalleeName() = "typeof"
  ) and
  DataFlow::localFlow(input, validationCall.getReceiver())
}

from DataFlow::Node input
where
  isFormInputAccess(input) and
  not hasValidation(input) and
  // Exclude inputs that are only used for display or logging
  not exists(CallExpr displayCall |
    displayCall.getCalleeName().matches(".*(log|console|display).*") and
    DataFlow::localFlow(input, displayCall.getAnArgument())
  )
select input, "Contact form input lacks proper validation, potential security risk"