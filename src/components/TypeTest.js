import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import { getLine } from "../constants/sentences";

export default function TypeTest() {
  const [line, setLine] = useState([]);
  const lineRef = useRef(line);
  const charIndex = useRef(0);
  const [isNewLine, setIsNewLine] = useState(true);
  const [linesOver, setLinesOver] = useState(false);
  //true: start, false: end
  const [typingStart, setTypingStart] = useState(false);
  const typingStartRef = useRef(typingStart);
  const [typingSpeed, setTypingSpeed] = useState(0);
  const timerId = useRef(-1);
  const startTime = useRef(-1);

  const colors = {
    base: "skyblue",
    correct: "lightgreen",
    wrong: "#fb3640",
    current: "#ffc55c",
  };

  //set initial values
  useEffect(() => {
    console.log("Setting first line");
    changeToNextLine();
  }, []);

  //update new lines
  useEffect(() => {
    if (line.length == 0) return;
    if (isNewLine) {
      newLineInit();
      setIsNewLine(false);
    }
  }, [line, isNewLine]);

  //start/stop typing speed interval
  useEffect(() => {
    console.log("Typing Start: ", typingStart, typingStartRef.current);
    if (typingStartRef.current) {
      //start setInterval
      if (startTime.current == -1) {
        console.log("Timer started");
        startTime.current = new Date().getTime() / 1000;

        timerId.current = setInterval(() => {
          setTypingSpeed(getTypingSpeed());
        }, 1000);
      }
    }
    // else {
    //   //end setInterval
    //   if (startTime.current !== -1) {
    //     console.log("Typing Finished");
    //     clearInterval(timerId.current);
    //   }
    // }
  }, [typingStart]);

  const getTypingSpeed = () => {
    const currTime = new Date().getTime() / 1000;
    const timeUsed = (currTime - startTime.current) / 60;
    console.log("Time Used:", timeUsed);
    let currCharIndex = charIndex.current;
    let speed = currCharIndex / (5 * timeUsed);
    console.log("Speed: ", speed);
    return Math.floor(speed);
  };

  const newLineInit = () => {
    console.log("Initialising Line");

    //set all backgrounds to skyblue
    for (let i = 0; i < line.length; i++) changeColor(i, colors.base);

    //remove previous event listener
    window.removeEventListener("keypress", keypressHandler);

    changeColor(0, "#ffc55c");
    //add new event listener
    window.addEventListener("keypress", keypressHandler);
  };

  const keypressHandler = useCallback((e) => {
    //typing started
    if (!typingStartRef.current) {
      setTypingStart(true);
      typingStartRef.current = true;
    }

    const idx = charIndex.current;
    console.log(idx, typingStartRef);
    if (idx < lineRef.current.length) {
      if (e.key === lineRef.current[idx]) {
        charIndex.current++;
        changeColor(idx, colors.correct);

        //change color of next to highlight the current character
        if (idx + 1 < lineRef.current.length)
          changeColor(idx + 1, colors.current);
        //if no next character, then end the typing
        else {
          cleanupCurrentLine();

          //update the final speed
          setTypingSpeed(getTypingSpeed());

          changeToNextLine();
        }
      } else {
        changeColor(idx, colors.wrong);
      }
    }
  }, []);

  const cleanupCurrentLine = () => {
    setTypingStart(false);
    typingStartRef.current = false;
    console.log("Over!!!!!!!");

    window.removeEventListener("keypress", keypressHandler);
  };

  const changeToNextLine = () => {
    console.log("Changing to next line");

    const newLine = getLine();
    if (newLine === -1) {
      console.log("Lines over");
      setLinesOver(true);
      clearInterval(timerId.current);
    }
    setLine(newLine);
    lineRef.current = newLine;
    charIndex.current = 0;
    setIsNewLine(true);

    // newLineInit();
  };

  const changeColor = (idx, color) => {
    const charDiv = document.querySelector(`.char[idx=c${idx}]`);
    // console.log(charDiv.style["background-color"]);
    // if (charDiv.style["background-color"] !== colors.wrong)
    if (charDiv) charDiv.style["background-color"] = color;
  };

  return (
    <Container>
      <TargetContainer>
        {linesOver ? (
          <LinesOverContainer>
            So Fast! I got no more lines for you.
          </LinesOverContainer>
        ) : (
          <CharacterContainer>
            {line.map((char, index) => (
              <div key={index} className="char" idx={`c${index}`}>
                {char}
              </div>
            ))}
          </CharacterContainer>
        )}
      </TargetContainer>
      <UserTypingContainer>
        {/* <button
          onClick={() => {
            setIsTyping(true);
          }}
        >
          Start Typing
        </button> */}
        <UserSpeed>Speed: {typingSpeed} wpm</UserSpeed>
      </UserTypingContainer>
    </Container>
  );
}

const Container = styled.div``;
const TargetContainer = styled.div``;
const UserTypingContainer = styled.div``;
const CharacterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 5px;
  .char {
    display: inline-block;
    height: 45px;
    width: 30px;
    text-align: center;
    margin: 0 1px 1px 0;
    padding: 1px;
    font-size: 2rem;
  }
`;
const UserSpeed = styled.div``;
const LinesOverContainer = styled.div``;
