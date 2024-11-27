import React, { useState } from 'react';
import { Pencil, X } from 'lucide-react';

export default function EditableContent({ content, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);

  const handleSave = (e) => {
    e.preventDefault();
    onSave(editContent.trim());
    setIsEditing(false);
  };

  return isEditing ? (
    <form onSubmit={handleSave} className="w-full">
      <textarea
        value={editContent}
        onChange={(e) => setEditContent(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white mb-3"
        rows={3}
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </form>
  ) : (
    <div className="relative">
      <p className="text-gray-800 mb-3">{content}</p>
      <button onClick={() => setIsEditing(true)} className="absolute top-0 right-0 text-gray-500 hover:text-blue-500 transition-colors">
        <Pencil size={16} />
      </button>
    </div>
  );
}
