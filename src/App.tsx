"use client";

import { useRef, useState, createRef, useEffect } from "react";
import { flushSync } from "react-dom";
import { v4 as uuid } from "uuid";
import { uniqueNamesGenerator, names } from "unique-names-generator";

type Person = {
	id: string;
	name: string;
	ref: React.RefObject<HTMLLIElement>;
	style: React.CSSProperties;
};

function Example() {
	const listRef = useRef<HTMLUListElement | null>(null);
	const [people, setPeople] = useState<Person[]>([]);
	const [keyword, setKeyword] = useState("");
	const [searchList, setSearchList] = useState<string[]>([]);
	const [count, setCount] = useState(0);

	const handleAddClick = () => {
		// 👇 Will wait until the DOM is updated with the new state
		flushSync(() => {
			setPeople((people) => [
				...people,
				{
					id: uuid(),
					name: uniqueNamesGenerator({
						dictionaries: [names],
					}),
					ref: createRef(),
					style: {},
				},
			]);
		});
	};

	// 状態を更新する関数
	const search = (keyword: string) => {
		let arr: string[] = [];
		setPeople(
			people.map((person) => {
				if (
					person.ref.current?.textContent?.includes(keyword) &&
					keyword !== ""
				) {
					arr.push(person.id);
					return { ...person, style: { backgroundColor: "gray" } };
				} else {
					return { ...person, style: { backgroundColor: "" } };
				}
			})
		);
		setSearchList(arr);
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === "Enter") {
			event.preventDefault();

			// ここでEnterキーが押されたときに実行したいアクションを実装する
			people.forEach((person) => {
				if (person.id === searchList[count]) {
					setPeople((prevPeople) =>
						prevPeople.map((p) =>
							p.style.backgroundColor === "yellow"
								? { ...p, style: { backgroundColor: "gray" } }
								: p
						)
					);
					setPeople((prevPeople) =>
						prevPeople.map((p) =>
							p.id === person.id
								? { ...p, style: { backgroundColor: "yellow" } }
								: p
						)
					);
					person.ref.current?.scrollIntoView({ block: "center" });
				}
			});
			if (searchList.length - 1 > count) {
				setCount((prev) => prev + 1);
			} else {
				setCount(0);
			}
		}
	};

	useEffect(() => {
		//reset style of people when keyword is nothing
		if (keyword.length <= 0) {
			setPeople((prevPeople) =>
				prevPeople.map((person) => {
					return { ...person, style: { backgroundColor: "" } };
				})
			);
		}
		setCount(0);
	}, [keyword]);

	return (
		<>
			<div>
				<input
					value={keyword}
					onChange={(e) => {
						const newKeyword = e.target.value;
						setKeyword(newKeyword);
						setSearchList([]);
						search(newKeyword);
					}}
					onKeyDown={handleKeyDown}
					className="text-black border p-1 m-3 rounded-lg border-black "
				/>
			</div>

			<button onClick={handleAddClick} className="border border-black p-1 m-3">
				Add new person
			</button>
			<ul ref={listRef}>
				{people.map((person) => (
					<li
						key={person.id}
						ref={person.ref}
						style={person.style}
						className="w-36 p-3"
					>
						{person.name}
					</li>
				))}
			</ul>
		</>
	);
}

export default Example;
