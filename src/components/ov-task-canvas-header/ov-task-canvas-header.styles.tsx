import { default as styled } from "react-emotion";

export const Wrapper = styled("div")`
  display: flex;
  flex-flow: nowrap;
  flex-grow: 1;
  flex-shrink: 1;
  overflow-x: hidden;
  width: 100%;
`;

export const TextWrapper = styled("div")`
  justify-content: center;
  overflow: hidden;
  display: flex;
  flex-flow: column nowrap;
  flex-grow: 1;
  flex-shrink: 1;
`;

export const TitleWrapper = styled("div")`
  overflow: hidden;
  margin-left: 0px;
  margin-right: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  font-weight: bold;
`;

export const ActivityWrapper = styled("div")`
  font-size: 12px;
  font-weight: normal;
  margin-top: 2px;
  overflow: hidden;
  margin-left: 0px;
  margin-right: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Button = styled("button")`
  padding: 0px 16px;
  border: none;
  outline: none;
  align-self: center;
  height: 28px;
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 2px;
  white-space: nowrap;
  border-radius: 100px;
  color: rgb(255, 255, 255);
  cursor: pointer;
`;
