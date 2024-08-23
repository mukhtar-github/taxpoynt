import React from 'react'
import { getDocuments } from '@/lib/actions/document.actions'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import DocumentList from '@/components/DocumentList'

interface Document {
  $id: string;
  name: string;
  type: string;
  uploadDate: string;
  userId: string;
  fileUrl: string;
  size: string;
  status: string;
}

const Documents = async () => {
  const loggedIn = await getLoggedInUser()
  const documents: Document[] = loggedIn ? await getDocuments(loggedIn.id) : []

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Documents</h1>
      <DocumentList documents={documents} />
    </div>
  )
}

export default Documents