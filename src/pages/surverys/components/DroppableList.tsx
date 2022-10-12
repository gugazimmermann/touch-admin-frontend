import { ReactElement } from "react";
import { DragDropContext, Droppable, DroppableProvided, DropResult } from "react-beautiful-dnd";
import { SurveyAnswerType, SurveyQuestionType, SurveyType, UUID } from "../../../interfaces/types";
import DraggableItem from "./DraggableItem";

type DroppableListProps = {
  type: "answers" | "questions";
  droppableID: UUID;
  survey: SurveyType;
  setSurvey: (survey: SurveyType) => void;
  question: SurveyQuestionType;
  setQuestion: (question: SurveyQuestionType) => void;
};

export default function DroppableList({
  type,
  droppableID,
  survey,
  setSurvey,
  question,
  setQuestion,
}: DroppableListProps): ReactElement {

  const reorder = (s: number, d: number) => {
    const r = type === "answers" ? Array.from(question.answers) : Array.from(survey.questions);
    const [removed] = r.splice(s, 1);
    r.splice(d, 0, removed);
    return r;
  };

  const handleDragEnd = ({ destination: d, source: s }: DropResult): void => {
    if (!d) return;
    if (d.index === s.index) return;
    const ordered = reorder(s.index, d.index).map((a, i) => {
      a.order = i + 1;
      return a;
    });
    if (type === "answers") {
      setQuestion({ ...question, answers: ordered as SurveyAnswerType[] });
    } else {
      setSurvey({...survey, questions: ordered as SurveyQuestionType[]})
    }
  }

  const handleRemove = (id: UUID): void => {
    const content = type === "answers" ? question.answers : survey.questions;
    const removed = content.filter((x) => x.id !== id);
    if (type === "answers") setQuestion({...question, answers: removed as SurveyAnswerType[]});
    else setSurvey({...survey, questions: removed as SurveyQuestionType[]})
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId={droppableID}>
        {(provided: DroppableProvided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="w-full"
          >
            {(type === "answers" ? question.answers : survey.questions).map((item: SurveyAnswerType | SurveyQuestionType, i: number) => (
              <DraggableItem
                key={item.id}
                id={item.id}
                text={item.text}
                index={i}
                onRemove={handleRemove}
            />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
