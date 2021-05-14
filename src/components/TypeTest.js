import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import { getLine } from "../constants/sentences";

export default function TypeTest() {
  const [line, setLine] = useState([]);
  const lineRef = useRef(line);
  const charIndex = useRef(0);
  const [isNewLine, setIsNewLine] = useState(true);
  const [linesOver, setLinesOver] = useState(false);
  const [typingStart, setTypingStart] = useState(false);
  const typingStartRef = useRef(typingStart);
  const [typingSpeed, setTypingSpeed] = useState(0);
  const timerId = useRef(-1);
  const startTime = useRef(-1);
  const correctCharCount = useRef(0);
  const totalKeyCount = useRef(0);
  const [accuracy, setAccuracy] = useState(0);

  const colors = {
    base: "skyblue",
    correct: "lightgreen",
    wrong: "#fb3640",
    current: "#ffc55c",
  };

  //set initial values
  useEffect(() => {
    // console.log("Setting first line");
    changeToNextLine();
  }, []);

  //update new lines
  useEffect(() => {
    if (line.length === 0) return;
    if (isNewLine) {
      newLineInit();
      setIsNewLine(false);
    }
  }, [line, isNewLine]);

  //start/stop typing speed interval
  useEffect(() => {
    // console.log("Typing Start: ", typingStart, typingStartRef.current);
    if (typingStartRef.current) {
      //start setInterval
      if (startTime.current === -1) {
        // console.log("Timer started");
        startTime.current = new Date().getTime() / 1000;

        timerId.current = setInterval(() => {
          // console.log("Calculating speed and accuracy");
          setTypingSpeed(getTypingSpeed());
          setAccuracy(getAccuracy());
        }, 1000);
      }
    }
  }, [typingStart]);

  const getTypingSpeed = () => {
    const currTime = new Date().getTime() / 1000;
    const timeUsed = (currTime - startTime.current) / 60;
    // console.log("Time Used:", timeUsed);
    let speed = correctCharCount.current / (5 * timeUsed);
    // console.log("Speed: ", speed);
    return Math.floor(speed);
  };

  const getAccuracy = () => {
    let currAccuracy = (correctCharCount.current / totalKeyCount.current) * 100;
    // console.log("Accuracy: ", currAccuracy);
    return currAccuracy.toFixed(2);
  };

  const newLineInit = () => {
    // console.log("Initialising Line");

    //set all backgrounds to skyblue
    for (let i = 0; i < line.length; i++) changeColor(i, colors.base);

    //remove previous event listener
    window.removeEventListener("keydown", keypressHandler);

    changeColor(0, "#ffc55c");
    //add new event listener
    window.addEventListener("keydown", keypressHandler);
  };

  const keypressHandler = useCallback((e) => {
    //typing started
    if (!typingStartRef.current) {
      setTypingStart(true);
      typingStartRef.current = true;
    }

    // console.log(e);
    const idx = charIndex.current;
    /*
    Cases:
    1. Shift -> Ignore
    2. Correct -> Mark green , go ahead
    3. Incorrect -> Mark red go ahead
    4. Backspace -> mark current with its base color, go back
    */
    if (idx < lineRef.current.length) {
      //Ignore shifts
      if (e.key === "Shift") return;

      totalKeyCount.current++;
      console.log(totalKeyCount.current);

      if (e.key === "Backspace") {
        if (idx == 0) return;

        changeColor(idx, colors.base);
        changeColor(idx - 1, colors.current);
        charIndex.current--;
      }
      //Correct Key
      else if (e.key === lineRef.current[idx]) {
        changeColor(idx, colors.correct);
        charIndex.current++;
        correctCharCount.current++;

        //Move to next character
        if (idx + 1 < lineRef.current.length)
          changeColor(idx + 1, colors.current);
        //No more characters left
        else {
          cleanupCurrentLine();
          changeToNextLine();
        }
      }
      //Wrong Key
      else {
        changeColor(idx, colors.wrong);
        charIndex.current++;
        //Move to next character
        if (idx + 1 < lineRef.current.length)
          changeColor(idx + 1, colors.current);
        //No more characters left
        else {
          cleanupCurrentLine();
          changeToNextLine();
        }
      }
    }
  }, []);

  const cleanupCurrentLine = () => {
    setTypingStart(false);
    typingStartRef.current = false;
    // console.log("Over!!!!!!!");

    window.removeEventListener("keypress", keypressHandler);

    //update the final speed and accuracy
    setTypingSpeed(getTypingSpeed());
    setAccuracy(getAccuracy());
  };

  const changeToNextLine = () => {
    // console.log("Changing to next line");

    const newLine = getLine();
    if (newLine === -1) {
      // console.log("Lines over");
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
        <UserAccuracy>Accuracy: {accuracy}%</UserAccuracy>
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
const UserAccuracy = styled.div``;
const LinesOverContainer = styled.div``;
