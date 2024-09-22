import React from 'react'
import { getDocuments } from '@/lib/actions/document.actions'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import DocumentList from '@/components/DocumentList'
import HeaderBox from '@/components/HeaderBox'  // Add this import

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
      <HeaderBox 
        type="title"
        title="My Documents"
        subtext="View and manage all your uploaded documents"
      />
      <DocumentList documents={documents as any} />
    </div>
  )
}

export default Documents