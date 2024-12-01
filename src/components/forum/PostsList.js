// src/components/PostsList.js

import React from "react";
import { MessageSquare, ArrowBigUp, Eye, Tag } from "lucide-react";
import { formatTimeAgo } from "../../utils/dateUtils"

export default function PostsList({ posts, onPostClick }) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <article
          key={post._id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
          onClick={() => {
            console.log(`Post click: ${post._id}`);
            onPostClick(post._id);
          }}
        >
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <img
                  src={post.authorAvatar}
                  alt={post.author}
                  className="w-10 h-10 rounded-full"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h2
                  className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(`Title click: ${post._id}`);
                    onPostClick(post._id);
                  }}
                >
                  {post.title}
                </h2>

                <p className="text-gray-600 line-clamp-2 mb-4">
                  {post.content}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <img
                      src={post.authorAvatar}
                      alt={post.author}
                      className="w-5 h-5 rounded-full"
                    />
                    <span className="font-medium text-gray-700">
                      {post.author}
                    </span>
                    <span>•</span>
                    <time className="text-gray-500">
                      {formatTimeAgo(post.timestamp)}
                    </time>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {post.tags.map((tag, index) => (
                      <span
                        key={tag + index}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium"
                      >
                        <Tag size={12} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div
                  className="flex items-center gap-2 text-gray-500 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(`Comments click: ${post._id}`);
                    onPostClick(post._id);
                  }}
                >
                  <MessageSquare />
                  <span className="font-medium">{post.comments.length}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-500">
                  <ArrowBigUp size={24} />
                  <span className="font-medium">{post.votes}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-500">
                  <Eye />
                  <span className="font-medium">{post.views}</span>
                </div>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
