export const FormHandleEnterKey = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();

    const form = e.target.form;
    const index = Array.prototype.indexOf.call(form, e.target);

    // find next focusable element
    let next = form.elements[index + 1];
    while (next && (next.disabled || next.type === "hidden")) {
      next = form.elements[Array.prototype.indexOf.call(form, next) + 1];
    }

    if (next) {
      next.focus();
    } else {
      // If all fields filled, check if user can submit
      const allFilled = Array.from(form.elements).every((el) => {
        if (el.tagName === "INPUT" && el.type !== "file") {
          return el.value.trim() !== "";
        }
        if (el.tagName === "SELECT") {
          return el.value.trim() !== "";
        }
        return true;
      });

      if (allFilled) {
        form.requestSubmit();
      }
    }
  }
};
