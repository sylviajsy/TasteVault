import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { GlobalSearchBar } from "./GlobalSearchBar";


export const AddNoteModal = ({ onClose }) => {
    const API_URL = import.meta.env.VITE_API_URL;

    const [loading, setLoading] = useState(false);
    const [winesResults, setWinesResults] = useState([]);
    const [selectedWine, setSelectedWine] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [formData, setFormData] = useState({
        wine_id: null,
        price: "",
        comment: "",
        user_acidity: 5,
        user_fizziness: 0,
        user_intensity: 5,
        user_sweetness: 5,
        user_tannin: 5,
        user_flavor: [],
    })
    const [tasteTags, setTasteTags] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);

    const sliderFields = [
        { name: "user_acidity", label: "Acidity" },
        { name: "user_fizziness", label: "Fizziness" },
        { name: "user_intensity", label: "Intensity" },
        { name: "user_sweetness", label: "Sweetness" },
        { name: "user_tannin", label: "Tannin" },
    ];

    const loadTasteTags = async () => {
        try {
            const res = await fetch(`${API_URL}/api/tasteTags`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to fetch taste tags");
            }

            setTasteTags(data);
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        loadTasteTags();
    }, []);

    const handleWineSearch = async (searchTerm) => {
        try {
            setLoading(true);

            const res = await fetch(`${API_URL}/api/wines?search=${encodeURIComponent(searchTerm)}`);
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Failed to fetch wines');
            }

            setWinesResults(data);
            console.log('Wine Journal Search', data);
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectWine = (wine) => {
        setSelectedWine(wine);
        setSearchInput(wine.name);

        setFormData((prev) => ({
            ...prev,
            wine_id: wine.wine_id,
        }));

        setWinesResults([]);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleWineSearchChange = (value) => {
        setSearchInput(value);

        if (selectedWine && value !== selectedWine.name) {
            setSelectedWine(null);

            setFormData((prev) => ({
                ...prev,
                wine_id: null,
            }));
        }
    };

    const handleSliderChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: Number(value),
        }));
    };

    const tagsByGroup = tasteTags.reduce((acc, tag) => {
        if (!acc[tag.group_name]) {
            acc[tag.group_name] = [];
        }

        acc[tag.group_name].push(tag);
        return acc;
        }, {}
    );

    const toggleGroup = (groupName) => {
        setSelectedGroups((prev) =>
            prev.includes(groupName)
            ? prev.filter((group) => group !== groupName)
            : [...prev, groupName]
        );
    }

    const toggleFlavorTag = (tagName, groupName) => {
        setFormData(prev => {
            let newFlavors = [...prev.user_flavor];

            const groupIndex = newFlavors.findIndex(
                (item) => item.group === groupName
            );

            if (groupIndex > -1) {
                // Group exists
                const currentNotes = newFlavors[groupIndex].notes;

                if (currentNotes.includes(tagName)) {
                     // if Note exist, Remove
                    const updatedNotes = currentNotes.filter((note) => note !== tagName);
                     // if group is empty after removing note, remove the whole group
                    if (updatedNotes.length==0){
                        newFlavors.splice(groupIndex, 1);
                    } else {
                        // if Note doesn't exist, add note
                        newFlavors[groupIndex] = {
                            ...newFlavors[groupIndex],
                            notes: [...currentNotes, tagName]
                        };
                    } 
                }
            } else {
                // Group doesn't exist
                newFlavors.push({
                    group: groupName,
                    notes: [tagName],
                });
            }
            return { ...prev, user_flavor: newFlavors };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.wine_id) {
            toast.error("Please select a wine first.");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(`${API_URL}/api/notes`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to save note");
            }

            toast.success("Tasting note saved!");
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

  return (
    <div onClick={onClose}>
        <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
            <div>
                <h2>Add Tasting Note</h2>
            </div>
            <button
                onClick={onClose}
            >
                ✕
            </button>

            <div>
                <label>Wine</label>
                
                <GlobalSearchBar 
                    value={searchInput}
                    onChange={handleWineSearchChange}
                    onSearch={handleWineSearch} 
                />
                    {loading && (
                        <p>Searching wines...</p>
                    )}

                    {winesResults.length > 1 && (
                        <div>
                            {winesResults.map((wine)=>{
                                return (
                                    <button
                                        key={wine.wine_id}
                                        type="button"
                                        onClick={() => handleSelectWine(wine)}
                                    >
                                        {wine.image_url && (
                                            <img
                                                src={wine.image_url}
                                                alt={wine.name}
                                            />
                                        )}
                                        {wine.name}
                                        {wine.winery}
                                    </button>
                                )
                            })}
                        </div>
                    )}
            </div>

            <label>
                <span>Price</span>
                <input 
                    name = "price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="19.99"
                    required
                />
            </label>

            {sliderFields.map((field) => (
                <label key={field.name}>
                    <div>
                        <span>{field.label}</span>
                        <span>{formData[field.name]}</span>
                    </div>

                    <input
                        name={field.name}
                        type="range"
                        min="0"
                        max="10"
                        value={formData[field.name]}
                        onChange={handleSliderChange}
                        required
                    />
                </label>
            ))}

            <label>
                <span>Flavors</span>
                {Object.keys(tagsByGroup).map((groupName) => {
                    const isSelected = selectedGroups.includes(groupName);
                    return (
                        <button
                            key={groupName}
                            type="button"
                            onClick={() => toggleGroup(groupName)}
                            className={`${
                                isSelected
                                ? "bg-[#6f102e] text-white"
                                : "bg-[#f2e2d6] text-[#5b1228]"
                            }`}
                        >
                            {groupName.replaceAll("_", " ")}
                        </button>
                    )
                })}

                {selectedGroups.map((groupName) => (
                    <div key={groupName} >
                        <span>{groupName.replaceAll("_", " ")}</span>
                        {tagsByGroup[groupName]?.map((tag) => {
                            const isSelected = formData.user_flavor.some((item) =>
                                item.group === groupName &&
                                item.notes.includes(tag.tag_name)
                            );

                            return (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => toggleFlavorTag(tag.tag_name, groupName)}
                                    className={`${
                                        isSelected
                                        ? "bg-[#6f102e] text-white"
                                        : "bg-[#f2e2d6] text-[#5b1228]"
                                    }`}
                                >
                                    {tag.tag_name.replaceAll("_", " ")}
                                </button>
                            )
                        })}
                    </div>
                ))}

                {formData.user_flavor.length>0 && (
                    <div>
                        {formData.user_flavor.map((flavorGroup) => (
                            <div key={flavorGroup.group}>
                                <span>{flavorGroup.group.replaceAll("_", " ")}: </span>
                                <span>
                                    {flavorGroup.notes.map((note) =>
                                        note.replaceAll("_", " ")
                                    ).join(", ")}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </label>

            <label>
                <span>Comment</span>
                <textarea
                    name = "comment"
                    value={formData.comment}
                    onChange={handleChange}
                    placeholder="What did you taste? (e.g. fruity, smooth, oak finish...)"
                />
            </label>

            <button type="submit">Submit</button>
        </form>
    </div>
  )
}
