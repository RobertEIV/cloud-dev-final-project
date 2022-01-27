/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateEntryRequest {
  name: string
  entryDate: string
  done: boolean
}