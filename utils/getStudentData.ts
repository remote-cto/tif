// utils/getStudentData.ts
export function getStudentData(): {
  id: string;
  name: string;
  email: string;
  registration_number: string;
  college_name: string;
} | null {
  if (typeof window !== "undefined") {
    try {
      const data = JSON.parse(sessionStorage.getItem("studentData") || "{}");
      return data?.id ? data : null;
    } catch {
      return null;
    }
  }
  return null;
}
