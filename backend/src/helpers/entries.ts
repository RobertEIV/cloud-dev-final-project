import { EntryAccess } from './entryAcess'
import { AttachmentUtils } from './attachmentUtils';
import { EntryItem } from '../models/EntryItem'
import { CreateEntryRequest } from '../requests/CreateEntryRequest'
import { UpdateEntryRequest } from '../requests/UpdateEntryRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
//import * as createError from 'http-errors'

// entry: Implement businessLogic
const entryAccess: EntryAccess = new EntryAccess()
const attachmentUtils: AttachmentUtils = new AttachmentUtils()
const logger = createLogger("Entry")

export async function createEntry(newEntryReq: CreateEntryRequest, userId: string): Promise<EntryItem> {
    logger.info("Creating entry for user ", userId)
    const createdAt: string = new Date().toISOString()
    const entryId: string = uuid.v4().toString()
    return await entryAccess.createEntry({
        entryId: entryId,
        userId: userId,
        name: newEntryReq.name,
        createdAt: createdAt,
        entryDate: newEntryReq.entryDate,
        done: false,
        location: newEntryReq.location,
        architect: newEntryReq.architect,
        attachmentUrl: '',
    })
}

export async function getEntriesForUser(userId: string): Promise<EntryItem[]> {
    logger.info("Getting entries for user ", userId)
    return await entryAccess.getEntries(userId)
}

export async function deleteEntry(userId: string, entryId: string) {
    logger.info("Deleting entry for user ", userId)
    return await entryAccess.deleteEntry(userId, entryId)
}

export async function updateEntry(userId: string, entryId: string, updatedEntry: UpdateEntryRequest) {
    logger.info("Updating entry for user ", userId)
    await entryAccess.updateEntry({
        name: updatedEntry.name,
        entryDate: updatedEntry.entryDate,
        done: updatedEntry.done
    }, userId, entryId)
}

export async function createAttachmentPresignedUrl(userId: string, entryId: string): Promise<string> {
    logger.info("Creating URL and attaching for item ", entryId)
    const imageId: string = uuid.v4().toString()
    const url: string = await attachmentUtils.getUploadUrl(imageId)
    const entry: EntryItem = await entryAccess.getEntry(userId, entryId)
    await entryAccess.attachUrl(imageId, entry)
    return url
}
