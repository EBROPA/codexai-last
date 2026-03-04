'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface SeamlessPDFViewerProps {
    pdfUrl: string;
    className?: string;
}

export const SeamlessPDFViewer: React.FC<SeamlessPDFViewerProps> = ({ pdfUrl, className = '' }) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const [visiblePages, setVisiblePages] = useState<Set<number>>(new Set([1, 2, 3]));
    const containerRef = useRef<HTMLDivElement>(null);
    const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());

    // Measure container width for responsive scaling
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    // Lazy loading with IntersectionObserver
    useEffect(() => {
        if (numPages === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const pageNum = parseInt(entry.target.getAttribute('data-page') || '0');
                    if (entry.isIntersecting && pageNum > 0) {
                        setVisiblePages((prev) => {
                            const newSet = new Set(prev);
                            // Load current page and adjacent pages
                            newSet.add(pageNum);
                            if (pageNum > 1) newSet.add(pageNum - 1);
                            if (pageNum < numPages) newSet.add(pageNum + 1);
                            return newSet;
                        });
                    }
                });
            },
            {
                rootMargin: '300px',
                threshold: 0.1,
            }
        );

        pageRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, [numPages]);

    const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        // Initially load first 3 pages
        setVisiblePages(new Set([1, 2, 3]));
    }, []);

    const setPageRef = useCallback((pageNum: number, ref: HTMLDivElement | null) => {
        if (ref) {
            pageRefs.current.set(pageNum, ref);
        }
    }, []);

    return (
        <div ref={containerRef} className={`w-full ${className}`}>
            <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                    <div className="flex items-center justify-center h-screen bg-zinc-900">
                        <div className="animate-pulse text-white font-mono text-sm">Loading PDF...</div>
                    </div>
                }
                error={
                    <div className="flex items-center justify-center h-screen bg-zinc-900">
                        <div className="text-red-500 font-mono text-sm">Failed to load PDF</div>
                    </div>
                }
                className="flex flex-col"
            >
                {/* Render all pages seamlessly without gaps */}
                {numPages > 0 && containerWidth > 0 && Array.from({ length: numPages }, (_, index) => {
                    const pageNum = index + 1;
                    const isVisible = visiblePages.has(pageNum);

                    return (
                        <div
                            key={`page_${pageNum}`}
                            ref={(ref) => setPageRef(pageNum, ref)}
                            data-page={pageNum}
                            style={{
                                // Remove any gaps between pages
                                lineHeight: 0,
                                fontSize: 0,
                                display: 'block',
                            }}
                        >
                            {isVisible ? (
                                <Page
                                    pageNumber={pageNum}
                                    width={containerWidth}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    loading={null}
                                    className="block"
                                />
                            ) : (
                                // Placeholder for unloaded pages (maintains scroll position)
                                <div
                                    style={{
                                        height: containerWidth * 1.4, // Approximate aspect ratio
                                        backgroundColor: '#f5f5f5',
                                    }}
                                />
                            )}
                        </div>
                    );
                })}
            </Document>
        </div>
    );
};
