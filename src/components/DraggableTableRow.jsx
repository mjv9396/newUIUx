import { useDrag, useDrop } from "react-dnd";
import { useRef, useState } from "react";
import styles from "../styles/DragDrop.module.css";

const DraggableTableRow = ({
  item,
  index,
  moveRow,
  onDragEnd,
  onUpdateLimit,
  isUpdating = false,
}) => {
  const ref = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.amountLimit);

  const [{ handlerId }, drop] = useDrop({
    accept: "tableRow",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(draggedItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveRow(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "tableRow",
    item: () => {
      return { id: item.acqMapId, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (monitor.didDrop() && onDragEnd) {
        setTimeout(() => {
          onDragEnd();
        }, 100);
      }
    },
  });

  const opacity = isDragging ? 0.5 : 1;
  drag(drop(ref));

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    onUpdateLimit(item, editValue);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setEditValue(item.amountLimit);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    setEditValue(e.target.value);
  };

  return (
    <tr
      ref={ref}
      style={{ opacity }}
      className={`${styles.draggableRow} ${isDragging ? styles.dragging : ""}`}
      data-handler-id={handlerId}
    >
      <td className={styles.dragHandle}>
        <i className="bi bi-grip-vertical" title="Drag to reorder priority"></i>
      </td>
      <td>{item.acqName}</td>
      <td>{item.acqProfileName}</td>
      <td>
        <span
          className={`badge ${styles.priorityBadge}`}
          style={{
            backgroundColor: "var(--primary)",
            color: "white",
          }}
        >
          {item.priority || "Unset"}
        </span>
      </td>
      <td>
        <div className="d-flex align-items-center gap-2">
          {isEditing ? (
            <>
              <input
                type="number"
                value={editValue}
                onChange={handleInputChange}
                className="form-control form-control-sm"
                style={{ width: "100px" }}
                min="0"
                step="0.01"
              />
              <button
                className="btn btn-sm"
                onClick={handleSaveClick}
                disabled={isUpdating}
                style={{
                  backgroundColor: "var(--secondary)",
                  borderColor: "var(--secondary)",
                  color: "white",
                }}
              >
                <i className="bi bi-check"></i>
              </button>
              <button
                className="btn btn-sm"
                onClick={handleCancelClick}
                disabled={isUpdating}
                style={{
                  backgroundColor: "var(--gray)",
                  borderColor: "var(--gray)",
                  color: "white",
                }}
              >
                <i className="bi bi-x"></i>
              </button>
            </>
          ) : (
            <div className="d-flex align-items-center gap-2 justify-content-center w-100">
              <span>
                {item.amountLimit === "0" || item.amountLimit === 0
                  ? "No Limit"
                  : item.amountLimit}
              </span>
              <button
                className="btn btn-sm"
                onClick={handleEditClick}
                disabled={isUpdating}
                style={{
                  backgroundColor: "transparent",
                  borderColor: "var(--primary)",
                  color: "var(--primary)",
                }}
              >
                <i className="bi bi-pencil"></i>
              </button>
            </div>
          )}
          {isUpdating && <i className="bi bi-arrow-repeat spin"></i>}
        </div>
      </td>
    </tr>
  );
};

export default DraggableTableRow;
