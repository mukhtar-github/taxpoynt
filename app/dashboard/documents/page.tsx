import React from 'react'
import { getDocuments } from 'lib/actions/document.actions'
import DocumentList from 'components/DocumentList'
import HeaderBox from 'components/HeaderBox'  // Add this import
import { User } from 'types'
import { useUser } from 'hooks/useUser';

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
  const { user } = useUser();
  const loggedIn = user as User; // Removed unnecessary 'unknown' type assertion

  // Ensure that 'getDocuments' returns plain objects
  const documents: Document[] = loggedIn ? await getDocuments(loggedIn.id) : []

  // Serialize documents to plain objects if necessary
  const serializedDocuments = JSON.parse(JSON.stringify(documents));

  return (
    <div className="p-6">
      <HeaderBox 
        user={loggedIn.id}
        type="title"
        title="My Documents"
        subtext="View and manage all your uploaded documents"
      />
      <DocumentList documents={serializedDocuments} /> {/* Pass serialized data */}
    </div>
  )
}

export default Documents