"use client";
import React, { useEffect, useState } from "react";

var bcrypt = require("bcryptjs");

const SignupForm: React.FC = () => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localUsers, setLocalUsers] = useState<any[] | undefined>();

  const hashPassword = async (password: string) => {
    return new Promise((resolve) => {
      bcrypt.genSalt(1, function (_: any, salt: string) {
        bcrypt.hash(password, salt, function (_: any, hash: string) {
          resolve(hash);
        });
      });
    });
  };

  const getUserObj = async (password: string) => {
    const json = localStorage.getItem("users");
    let ret;
    if (json) {
      if (json.includes(email)) {
        return null;
      }
      ret = JSON.parse(json);
    }
    const hash = await hashPassword(password);
    const newUser = {
      id: id,
      password: hash,
      name: name,
      email: email,
    };
    // Ensure prev is always treated as an array
    const updatedUsers = ret ? [...ret, newUser] : [newUser];

    return updatedUsers;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !name || !password || !confirmPassword) {
      alert("값을 입력해주세요.");
      return;
    }
    if (id.length < 5 || password.length < 8 || confirmPassword.length < 8) {
      if (id.length < 5) {
        alert("최소 5자 이상 입력해주세요.");
      } else {
        alert("최소 8자 이상 입력해주세요.");
      }
      return;
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      alert("이메일 형식에 맞게 입력해주세요.");
      return;
    }
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
    }
    if (id.length > 15 || password.length > 20 || confirmPassword.length > 20) {
      if (id.length > 15) {
        alert("최대 15자 이하로 입력해주세요.");
      } else {
        alert("최대 20자 이하로 입력해주세요.");
      }
      return;
    }
    if (!/^[a-zA-Z0-9]+$/.test(password)) {
      alert("영문과 숫자만 입혁해주세요.");
      return;
    }

    const userObj = await getUserObj(password);
    if (userObj === null) {
      alert("이미 존재하는 이메일입니다.");
      return;
    }
    localStorage.setItem("users", JSON.stringify(userObj));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="id">ID:</label>
        <input id="id" value={id} onChange={(e) => setId(e.target.value)} />
      </div>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default SignupForm;
