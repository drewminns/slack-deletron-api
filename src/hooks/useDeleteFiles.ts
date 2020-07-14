import { useState } from 'react'
import { useRecoilState } from 'recoil'

import { FileResponse } from '../../shared'
import {
  queuedFilesState,
  applicationErrorState,
  deleteFileSizeState,
  fetchedFilesState,
  userDetailsState,
} from '../state'

async function wait(ms: number) {
  return new Promise((resolve: any) => {
    setTimeout(resolve, ms)
  })
}

const DELETE_ENDPOINT = 'https://slack.com/api/files.delete?'

export const useDeleteFiles = (fileArray: FileResponse[]) => {
  const [applicationError, setApplicationError] = useRecoilState(applicationErrorState)
  const [deletedFileSize, setDeletedFileSize] = useRecoilState(deleteFileSizeState)
  const [queuedFiles, setQueuedFiles] = useRecoilState(queuedFilesState)
  const [fetchedFiles, setFetchedFiles] = useRecoilState(fetchedFilesState)
  const [userDetails] = useRecoilState(userDetailsState)
  const [isLoading, setIsLoading] = useState(false)

  const { token } = userDetails

  const deleteFile = async (id: string, size: number) => {
    try {
      const deleteFileFetch = await fetch(DELETE_ENDPOINT + new URLSearchParams({ token, file: id }))
      const deletedFile = await deleteFileFetch.json()
      if (deletedFile.ok) {
        setFetchedFiles(fetchedFiles.filter((file: any) => file.id !== id))
        setQueuedFiles(queuedFiles.filter((file: FileResponse) => file.id !== id))
        setDeletedFileSize(deletedFileSize + size)
      } else {
        setApplicationError({ active: true, value: deletedFile.error })
      }
    } catch (error) {
      setApplicationError({ active: true, value: error })
    }
  }

  const deleteAll = async () => {
    const deletedItems: string[] = []
    let deletedFileSizeBatch = 0
    setIsLoading(true)
    for (const file of fileArray) {
      try {
        const deleteQueuedFile = await fetch(DELETE_ENDPOINT + new URLSearchParams({ token, file: file.id }))
        const deleteQueuedFileResponse = await deleteQueuedFile.json()
        if (deleteQueuedFileResponse.ok) {
          deletedItems.push(file.id)
          deletedFileSizeBatch += file.size
        } else {
          setApplicationError({ active: true, value: 'Deleting Error' })
          break
        }
        await wait(1250)
      } catch (err) {
        setApplicationError({ active: true, value: err })
        setIsLoading(false)
      }
    }

    setDeletedFileSize(deletedFileSize + deletedFileSizeBatch)
    setQueuedFiles(queuedFiles.filter((file: FileResponse) => !deletedItems.includes(file.id)))
    setFetchedFiles(fetchedFiles.filter((file: FileResponse) => !deletedItems.includes(file.id)))
    setIsLoading(false)
  }

  return {
    deleteFile,
    deleteAll,
    isLoading,
  }
}
