/** @format */

// export function ValidateName(name: string) {
//     if (/^[a-zA-Z ]{2,30}$/.test(name)) {
//         return true;
//     }
//     return false;
// }

export function ValidateEmail(email: string) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true;
  }
  return false;
}
