import { Draggable, DraggableProvided } from "react-beautiful-dnd";
import { Input } from "../../../components";
import { UUID } from "../../../interfaces/types";

type ItemProps = {
  id: UUID;
  text: string;
  index: number;
  onRemove: (id: UUID) => void;
}

const DraggableItem = ({ id, text, index, onRemove }: ItemProps) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided: DraggableProvided) => (
        <div
          className="item-container"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="w-full flex flex-wrap">
            <div className="item-container flex items-center justify-center w-1/12 mb-4">
              <i className="bx bx-move-vertical text-xl" />
            </div>
            <div className="w-9/12 pr-4 mb-4">
              <Input value={text} type="text" disabled />
            </div>
            <div className="flex items-center w-2/12 mb-4">
              <button
                type="button"
                onClick={() => onRemove(id)}
                className="flex items-center justify-center w-full h-full bg-danger px-2 py-1 text-xs text-white font-semibold uppercase rounded shadow-md cursor-pointer"
              >
                <i className="bx bx-minus-circle text-xl sm:mr-2" />
                <span className="hidden sm:flex">Remover</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default DraggableItem;
