import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { getLine } from "../constants/sentences";

export default function TypeTest() {
  const [line, setLine] = useState([]);
  const charIndex = useRef(0);
  const [isNewLine, setIsNewLine] = useState(true);
  //true: start, false: end
  const [typingStart, setTypingStart] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(0);

  const colors = {
    base: "skyblue",
    correct: "lightgreen",
    wrong: "#fb3640",
    current: "#ffc55c",
  };
  let timerId = -1;
  let startTime = -1;
  let prevCharIndex = 0;

  useEffect(() => {
    const newLine = getLine();
    setLine(newLine);
    charIndex.current = 0;
  }, []);

  useEffect(() => {
    if (line.length == 0) return;
    if (isNewLine) {
      newLineInit(line);
      setIsNewLine(false);
    }
  }, [line]);

  useEffect(() => {
    console.log("Typing Start: ", typingStart);
    if (typingStart) {
      //start setInterval
      if (startTime == -1) {
        console.log("Timer started");
        startTime = new Date().getTime() / 1000;

        timerId = setInterval(() => {
          setTypingSpeed(getTypingSpeed());
        }, 3000);
      }
    } else {
      //end setInterval
      if (startTime != -1) {
        console.log("Typing Finished");
        clearInterval(timerId);
      }
    }
  }, [typingStart]);

  const getTypingSpeed = () => {
    const currTime = new Date().getTime() / 1000;
    const timeUsed = (currTime - startTime) / 60;
    let currCharIndex = charIndex.current;
    let speed = currCharIndex / (5 * timeUsed);
    return Math.floor(speed);
  };

  const newLineInit = (lineArray) => {
    //set all backgrounds to skyblue
    for (let i = 0; i < line.length; i++) changeColor(i, colors.base);

    //remove previous event listener
    window.removeEventListener("keypress", () => {});

    changeColor(0, "#ffc55c");
    //add new event listener
    window.addEventListener("keypress", (e) => {
      //typing started
      if (!typingStart) setTypingStart(start => !start);

      const idx = charIndex.current;
      console.log(idx, typingStart);
      if (idx < line.length) {
        if (e.key === lineArray[idx]) {
          // console.log("Correct");
          charIndex.current++;
          changeColor(idx, colors.correct);
          if (idx + 1 < line.length) changeColor(idx + 1, colors.current);
        } else {
          // console.log("Wrong");
          changeColor(idx, colors.wrong);

          // setTimeout(() => {
          //   changeColor(idx, "#ffc55c");
          // }, 100);
        }
      } else {
        if (typingStart) {
          setTypingStart(false);
          console.log("Over!!!!!!!");
          window.removeEventListener("keypress", () => {});
        }
      }
    });
  };

  const changeColor = (idx, color) => {
    const charDiv = document.querySelector(`.char[idx=c${idx}]`);
    // console.log(charDiv.style["background-color"]);
    // if (charDiv.style["background-color"] !== colors.wrong)
    charDiv.style["background-color"] = color;
  };

  return (
    <Container>
      <TargetContainer>
        <CharacterContainer>
          {line.map((char, index) => (
            <div key={index} className="char" idx={`c${index}`}>
              {char}
            </div>
          ))}
        </CharacterContainer>
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
