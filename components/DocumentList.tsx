'use client'

import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Button } from './ui/button'

const DocumentList = ({ documents }: { documents: any[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Upload Date</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((document: any) => (
          <TableRow key={document.id}>
            <TableCell>{document.name}</TableCell>
            <TableCell>{document.type}</TableCell>
            <TableCell>{document.uploadDate}</TableCell>
            <TableCell>
              <Button asChild>
                <a href={document.downloadUrl} download>Download</a>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default DocumentList
