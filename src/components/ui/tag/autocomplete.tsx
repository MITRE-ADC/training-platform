import React, { useCallback, useEffect, useRef, useState } from "react";
// import { Command, CommandList, CommandItem, CommandGroup, CommandEmpty } from '../ui/command';
import { TagInputStyleClassesProps, type Tag as TagType } from "./tag-input";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { P } from "../custom/text";
import { Checkbox } from "../checkbox";

type AutocompleteProps = {
  tags: TagType[];
  setTags: React.Dispatch<React.SetStateAction<TagType[]>>;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  setTagCount: React.Dispatch<React.SetStateAction<number>>;
  autocompleteOptions: TagType[];
  maxTags?: number;
  onTagAdd?: (tag: string) => void;
  onTagRemove?: (tag: string) => void;
  allowDuplicates: boolean;
  children: React.ReactNode;
  inlineTags?: boolean;
  classStyleProps: TagInputStyleClassesProps["autoComplete"];
  usePortal?: boolean;
};

export const Autocomplete: React.FC<AutocompleteProps> = ({
  tags,
  setTags,
  setInputValue,
  setTagCount,
  autocompleteOptions,
  maxTags,
  onTagAdd,
  onTagRemove,
  allowDuplicates,
  inlineTags,
  children,
  classStyleProps,
  usePortal,
}) => {
  const triggerContainerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const popoverContentRef = useRef<HTMLDivElement | null>(null);

  // eslint-disable-next-line
  const [popoverWidth, setPopoverWidth] = useState<number>(0);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [popooverContentTop, setPopoverContentTop] = useState<number>(0);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  // Dynamically calculate the top position for the popover content
  useEffect(() => {
    if (!triggerContainerRef.current || !triggerRef.current) return;
    setPopoverContentTop(
      triggerContainerRef.current?.getBoundingClientRect().bottom -
        triggerRef.current?.getBoundingClientRect().bottom
    );
  }, [tags]);

  // Close the popover when clicking outside of it
  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent
    ) => {
      if (
        isPopoverOpen &&
        triggerContainerRef.current &&
        popoverContentRef.current &&
        !triggerContainerRef.current.contains(event.target as Node) &&
        !popoverContentRef.current.contains(event.target as Node)
      ) {
        setIsPopoverOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isPopoverOpen]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open && triggerContainerRef.current) {
        const { width } = triggerContainerRef.current.getBoundingClientRect();
        setPopoverWidth(width);
      }

      if (open) {
        inputRef.current?.focus();
        setIsPopoverOpen(open);
      }
    }, // eslint-disable-next-line
    [inputFocused]
  );

  const handleInputFocus = (
    event:
      | React.FocusEvent<HTMLInputElement>
      | React.FocusEvent<HTMLTextAreaElement>
  ) => {
    if (triggerContainerRef.current) {
      const { width } = triggerContainerRef.current.getBoundingClientRect();
      setPopoverWidth(width);
      setIsPopoverOpen(true);
    }

    // Only set inputFocused to true if the popover is already open.
    // This will prevent the popover from opening due to an input focus if it was initially closed.
    if (isPopoverOpen) {
      setInputFocused(true);
    }
    // eslint-disable-next-line
    const userOnFocus = (children as React.ReactElement<any>).props.onFocus;
    if (userOnFocus) userOnFocus(event);
  };

  const handleInputBlur = (
    event:
      | React.FocusEvent<HTMLInputElement>
      | React.FocusEvent<HTMLTextAreaElement>
  ) => {
    setInputFocused(false);

    // Allow the popover to close if no other interactions keep it open
    if (!isPopoverOpen) {
      setIsPopoverOpen(false);
    }
    // eslint-disable-next-line
    const userOnBlur = (children as React.ReactElement<any>).props.onBlur;
    if (userOnBlur) userOnBlur(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isPopoverOpen) return;

    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex <= 0 ? autocompleteOptions.length - 1 : prevIndex - 1
        );
        break;
      case "ArrowDown":
        event.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex === autocompleteOptions.length - 1 ? 0 : prevIndex + 1
        );
        break;
      case "Enter":
        event.preventDefault();
        if (selectedIndex !== -1) {
          toggleTag(autocompleteOptions[selectedIndex]);
          setSelectedIndex(-1);
        }
        break;
    }
  };

  const toggleTag = (option: TagType) => {
    // Check if the tag already exists in the array
    const index = tags.findIndex((tag) => tag.text === option.text);

    if (index >= 0) {
      // Tag exists, remove it
      const newTags = tags.filter((_, i) => i !== index);
      setTags(newTags);
      setTagCount((prevCount) => prevCount - 1);
      if (onTagRemove) {
        onTagRemove(option.text);
      }
    } else {
      // Tag doesn't exist, add it if allowed
      if (!allowDuplicates && tags.some((tag) => tag.text === option.text)) {
        // If duplicates aren't allowed and a tag with the same text exists, do nothing
        return;
      }

      // Add the tag if it doesn't exceed max tags, if applicable
      if (!maxTags || tags.length < maxTags) {
        setTags([...tags, option]);
        setTagCount((prevCount) => prevCount + 1);
        setInputValue("");
        if (onTagAdd) {
          onTagAdd(option.text);
        }
      }
    }
    setSelectedIndex(-1);
  };

  const childrenWithProps = React.cloneElement(
    // eslint-disable-next-line
    children as React.ReactElement<any>,
    {
      onKeyDown: handleKeyDown,
      onFocus: handleInputFocus,
      onBlur: handleInputBlur,
      ref: inputRef,
    }
  );

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col overflow-hidden bg-popover text-popover-foreground",
        classStyleProps?.command
      )}
    >
      <Popover
        open={isPopoverOpen}
        onOpenChange={handleOpenChange}
        modal={usePortal}
      >
        <div
          className="relative flex h-full items-center bg-transparent"
          ref={triggerContainerRef}
        >
          {childrenWithProps}
          <PopoverTrigger asChild ref={triggerRef}>
            <Button
              variant="ghost"
              size="icon"
              role="combobox"
              className={cn(
                `flex hover:bg-transparent ${!inlineTags ? "ml-auto" : ""}`,
                classStyleProps?.popoverTrigger
              )}
              onClick={() => {
                setIsPopoverOpen(!isPopoverOpen);
              }}
            >
              {/*<div className="w-[1px] h-3/4 bg-highlight mr-3 ml-2"></div>*/}
              <i className={"ri-add-line ri-1x font-[100] text-darkBlue " + classStyleProps?.title}></i>
              <P className="mr-4 ml-2 translate-y-[1px] text-darkBlue">
                {classStyleProps?.popoverTriggerName}
              </P>
            </Button>
          </PopoverTrigger>
        </div>
        <PopoverContent
          ref={popoverContentRef}
          side="bottom"
          align="center"
          forceMount
          className={cn(`relative p-0`, classStyleProps?.popoverContent)}
          style={{
            top: `${popooverContentTop}px`,
            width: `240px`,
            minWidth: `240px` /* OVERRIDE */,
            zIndex: 9999,
          }}
        >
          <div
            className={cn(
              "max-h-[300px] overflow-y-auto overflow-x-hidden",
              classStyleProps?.commandList
            )}
            style={{
              minHeight: "68px",
            }}
            key={autocompleteOptions.length}
          >
            {autocompleteOptions.length > 0 ? (
              <div
                key={autocompleteOptions.length}
                role="group"
                className={cn(
                  "overflow-hidden overflow-y-auto p-1 text-foreground",
                  classStyleProps?.commandGroup
                )}
                style={{
                  minHeight: "68px",
                }}
              >
                <div role="separator" className="py-0.5" />
                {autocompleteOptions.map((option, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={option.id}
                      role="option"
                      aria-selected={isSelected}
                      className={cn(
                        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                        isSelected && "bg-accent text-accent-foreground",
                        classStyleProps?.commandItem
                      )}
                      data-value={option.text}
                      onClick={() => toggleTag(option)}
                    >
                      <div className="flex w-full items-center gap-2">
                        <Checkbox className="pointer-events-none" checked={tags.some((tag) => tag.text === option.text)}></Checkbox>
                        <P className="text-dark font-[600]">{option.text}</P>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-6 text-center text-sm">No results found.</div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
