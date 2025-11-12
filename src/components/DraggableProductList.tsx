'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { memo } from 'react';
import { Product } from '@/types/product';
import { GripVertical } from 'lucide-react';
import CloudinaryImage from './CloudinaryImage';

interface DraggableProductListProps {
  products: Product[];
  onReorder: (newOrder: Product[]) => void;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

interface SortableItemProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const SortableItem = memo(function SortableItem({ product, onEdit, onDelete }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 ${
        isDragging ? 'border-green-500 shadow-2xl scale-[1.02]' : 'border-gray-200'
      } transition-all duration-200 hover:shadow-xl`}
    >
      <div className="flex items-center gap-5 p-5">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-green-600 transition-colors flex-shrink-0 p-2 hover:bg-green-50 rounded-lg"
        >
          <GripVertical className="h-6 w-6" />
        </div>

        {/* Product Image */}
        <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200 shadow-sm">
          <CloudinaryImage
            src={product.images[0]?.url || '/placeholder.jpg'}
            alt={product.images[0]?.alt || product.title}
            fill
            className="object-cover"
          />
          {product.featured && (
            <div className="absolute top-1 right-1">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                ⭐
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg text-gray-900 truncate">
                  {product.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600 mt-1 overflow-hidden text-ellipsis line-clamp-2 leading-relaxed">
                {product.shortDescription}
              </p>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                  {product.category}
                </span>
                {product.featured && (
                  <span className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full border border-green-200">
                    Featured
                  </span>
                )}
                {product.subcategory && (
                  <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
                    {product.subcategory}
                  </span>
                )}
                <span className="text-xs text-gray-400 font-medium">
                  Order: {product.order ?? 'Not set'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => onEdit(product)}
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-all duration-200 border border-blue-200 hover:shadow-md"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="px-4 py-2 bg-red-50 text-red-700 rounded-xl text-sm font-semibold hover:bg-red-100 transition-all duration-200 border border-red-200 hover:shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

SortableItem.displayName = 'SortableItem';

export default function DraggableProductList({
  products,
  onReorder,
  onEdit,
  onDelete,
}: DraggableProductListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = products.findIndex((p) => p.id === active.id);
      const newIndex = products.findIndex((p) => p.id === over.id);

      const newProducts = arrayMove(products, oldIndex, newIndex);
      
      // Update order numbers
      const reorderedProducts = newProducts.map((product, index) => ({
        ...product,
        order: index + 1,
      }));

      onReorder(reorderedProducts);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={products.map((p) => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {products.map((product) => (
            <SortableItem
              key={product.id}
              product={product}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

