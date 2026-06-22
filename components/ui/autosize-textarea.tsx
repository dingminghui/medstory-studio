"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { useImperativeHandle } from "react";

interface UseAutosizeTextAreaProps {
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  minHeight?: number;
  maxHeight?: number;
}

function resizeTextarea({
  maxHeight,
  minHeight,
  textArea,
}: {
  maxHeight: number;
  minHeight: number;
  textArea: HTMLTextAreaElement | null;
}) {
  const offsetBorder = 6;

  if (!textArea) {
    return;
  }

  textArea.style.minHeight = `${minHeight + offsetBorder}px`;

  if (maxHeight > minHeight) {
    textArea.style.maxHeight = `${maxHeight}px`;
  }

  textArea.style.height = `${minHeight + offsetBorder}px`;

  const scrollHeight = textArea.scrollHeight;

  textArea.style.height =
    scrollHeight > maxHeight
      ? `${maxHeight}px`
      : `${scrollHeight + offsetBorder}px`;
}

const useAutosizeTextArea = ({
  textAreaRef,
  maxHeight = Number.MAX_SAFE_INTEGER,
  minHeight = 0,
}: UseAutosizeTextAreaProps) => {
  React.useLayoutEffect(() => {
    resizeTextarea({
      maxHeight,
      minHeight,
      textArea: textAreaRef.current,
    });
  }, [maxHeight, minHeight, textAreaRef]);
};

export type AutosizeTextAreaRef = {
  textArea: HTMLTextAreaElement;
  maxHeight: number;
  minHeight: number;
  focus: () => void;
};

type AutosizeTextAreaProps = {
  maxHeight?: number;
  minHeight?: number;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const AutosizeTextarea = React.forwardRef<
  AutosizeTextAreaRef,
  AutosizeTextAreaProps
>(
  (
    {
      maxHeight = Number.MAX_SAFE_INTEGER,
      minHeight = 52,
      className,
      onChange,
      value,
      ...props
    }: AutosizeTextAreaProps,
    ref: React.Ref<AutosizeTextAreaRef>,
  ) => {
    const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);

    useAutosizeTextArea({
      textAreaRef,
      maxHeight,
      minHeight,
    });

    React.useLayoutEffect(() => {
      resizeTextarea({
        maxHeight,
        minHeight,
        textArea: textAreaRef.current,
      });
    }, [maxHeight, minHeight, props.defaultValue, value]);

    useImperativeHandle(ref, () => ({
      textArea: textAreaRef.current as HTMLTextAreaElement,
      focus: () => textAreaRef?.current?.focus(),
      maxHeight,
      minHeight,
    }));

    return (
      <textarea
        {...props}
        value={value}
        ref={textAreaRef}
        className={cn(
          "text-foreground flex w-full resize-none bg-transparent text-base/6 focus:outline-none",
          className,
        )}
        onChange={(e) => {
          resizeTextarea({
            maxHeight,
            minHeight,
            textArea: e.currentTarget,
          });
          onChange?.(e);
        }}
      />
    );
  },
);
AutosizeTextarea.displayName = "AutosizeTextarea";
