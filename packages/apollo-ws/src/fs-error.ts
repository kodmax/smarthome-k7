interface FileSystemError extends Error {
  code: 'ENOENT'
}

const isFileSystemError = (e: any): e is FileSystemError => {
  return e instanceof Error && 'code' in e
}

export type { FileSystemError }
export { isFileSystemError }
