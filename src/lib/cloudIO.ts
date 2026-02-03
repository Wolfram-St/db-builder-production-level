// Stub cloud IO functions - local storage only
import { useDBStore } from "../store/dbStore";

/**
 * STUB: Cloud save disabled
 * @param projectId - The UUID of the project
 * @param name - (Optional) Update the project name
 */
export async function saveProjectToCloud(projectId: string, name?: string) {
  console.log('Cloud save is disabled. Use local file export instead.');
  throw new Error('Cloud save is disabled. Please use local file export.');
}

/**
 * STUB: Cloud load disabled
 * @param projectId - The UUID to fetch
 * @returns The name of the project
 */
export async function loadProjectFromCloud(projectId: string) {
  console.log('Cloud load is disabled. Use local file import instead.');
  throw new Error('Cloud load is disabled. Please use local file import.');
}