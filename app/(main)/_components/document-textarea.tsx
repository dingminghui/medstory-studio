"use client";

import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import TextType from "@/components/text-type";
import { MAX_DOCUMENT_TITLE_LENGTH } from "@/lib/document-model";

const PLACEHOLDER_TEXTS = [
  "冠状动脉搭桥术后胸痛评估",
  "2型糖尿病合并肾功能不全的药物治疗方案",
  "儿童反复呼吸道感染的免疫评估",
  "急性脑卒中后吞咽功能障碍的康复策略",
  "晚期非小细胞肺癌的靶向治疗选择",
];

type DocumentTextareaProps = {
  value: string;
  showPlaceholder: boolean;
  canSubmit: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function DocumentTextarea({
  value,
  showPlaceholder,
  canSubmit,
  onChange,
  onSubmit,
}: DocumentTextareaProps) {
  return (
    <div className="relative p-4 pb-3">
      <AutosizeTextarea
        id="document-title"
        className="relative z-10"
        maxHeight={120}
        maxLength={MAX_DOCUMENT_TITLE_LENGTH}
        minHeight={70}
        placeholder=""
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            if (canSubmit) {
              onSubmit();
            }
          }
        }}
      />

      <div className="text-muted-foreground pointer-events-none absolute top-4 right-4 left-4 z-0 truncate overflow-hidden text-base/6">
        {showPlaceholder ? (
          <TextType
            text={PLACEHOLDER_TEXTS}
            loop
            showCursor={false}
            pauseDuration={3000}
            typingSpeed={120}
            deletingSpeed={120}
            as="span"
          />
        ) : null}
      </div>
    </div>
  );
}
