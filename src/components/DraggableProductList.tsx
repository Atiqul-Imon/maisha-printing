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
import { Product } from '@/types/product';
import { GripVertical } from 'lucide-react';
import ImageKitImage from './ImageKitImage';

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

function SortableItem({ product, onEdit, onDelete }: SortableItemProps) {
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
      className={`bg-white rounded-lg shadow-md overflow-hidden border-2 ${
        isDragging ? 'border-green-500' : 'border-gray-200'
      } transition-all`}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-green-600 transition-colors flex-shrink-0"
        >
          <GripVertical className="h-6 w-6" />
        </div>

        {/* Product Image */}
        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
          <ImageKitImage
            src={product.images[0]?.url || '/placeholder.jpg'}
            alt={product.images[0]?.alt || product.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 truncate">
                {product.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1 overflow-hidden text-ellipsis line-clamp-2">
                {product.shortDescription}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {product.category}
                </span>
                {product.featured && (
                  <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    Featured
                  </span>
                )}
                <span className="text-xs text-gray-400">
                  Order: {product.order ?? 'Not set'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => onEdit(product)}
                className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
        <div className="space-y-3">
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

