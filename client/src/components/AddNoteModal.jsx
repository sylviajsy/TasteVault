import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import { useAuth0 } from '@auth0/auth0-react';
import { GlobalSearchBar } from "./GlobalSearchBar";

export const AddNoteModal = ({ onClose, onNoteAdded }) => {
    const API_URL = import.meta.env.VITE_API_URL;

    const [isSearchingWines, setIsSearchingWines] = useState(false);
    const [isSavingNote, setIsSavingNote] = useState(false);
    const [winesResults, setWinesResults] = useState([]);
    const [selectedWine, setSelectedWine] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [formData, setFormData] = useState({
        wine_id: null,
        price: "",
        comment: "",
        score:5,
        user_acidity: 5,
        user_fizziness: 0,
        user_intensity: 5,
        user_sweetness: 5,
        user_tannin: 5,
        user_flavor: [],
    })
    const [tasteTags, setTasteTags] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedText, setGeneratedText] = useState("");
    const closeButtonRef = useRef(null);
    const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();
    const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
    const titleId = "add-note-modal-title";

    const sliderFields = [
        {name: "score", label: "Score"},
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

    const handleGenerateNote = async () => {
        if (!isAuthenticated) {
            loginWithRedirect();
            return;
        }
        try {
            setIsGenerating(true);
            const token = await getAccessTokenSilently({
                    authorizationParams: {
                        audience: audience,
                }
            });

            const res = await fetch(`${API_URL}/api/ai/generate-note`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    score: formData.score,
                    user_acidity: formData.user_acidity,
                    user_fizziness: formData.user_fizziness,
                    user_intensity: formData.user_intensity,
                    user_sweetness: formData.user_sweetness,
                    user_tannin: formData.user_tannin,
                    user_flavor: formData.user_flavor,
                    comment: formData.comment,
                }),
            });
            const data = await res.json();

            if (!res.ok) {
            throw new Error(data.error || "Failed to generate note");
            }

            setGeneratedText(data.polishedContent);

            setFormData((prev) => ({
                ...prev,
                comment: data.polishedContent,
            }));
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setIsGenerating(false);
        }
    }

    useEffect(() => {
        loadTasteTags();
    }, []);

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    const handleWineSearch = useCallback(async (searchTerm) => {
        const cleaned = searchTerm.trim();

        if (!cleaned) {
            setWinesResults([]);
            return;
        }

        if (selectedWine && cleaned === selectedWine.name) {
            return;
        }

        try {
            setIsSearchingWines(true);

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
            setIsSearchingWines(false);
        }
    }, [API_URL, selectedWine])

    const handleSelectWine = (wine) => {
        setSelectedWine(wine);
        setSearchInput(wine.name);

        setFormData((prev) => ({
            ...prev,
            wine_id: Number(wine.id),
        }));

        setWinesResults([]);
    }

    const getWineImageSrc = (imageUrl) => {
        if (!imageUrl) {
            return null;
        }

        return imageUrl.startsWith("//") ? `https:${imageUrl}` : imageUrl;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
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
        if (selectedGroups.includes(groupName)) {
            setFormData((prev) => ({
                ...prev,
                user_flavor: prev.user_flavor.filter(
                    (item) => item.group !== groupName
                ),
            }));
        }

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
                        newFlavors[groupIndex] = {
                            ...newFlavors[groupIndex],
                            notes: updatedNotes
                        };
                    } 
                } else {
                    // if Note doesn't exist, add note
                    newFlavors[groupIndex] = {
                        ...newFlavors[groupIndex],
                        notes: [...currentNotes, tagName] 
                    };
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
        console.log("submit formData", formData);
        console.log("submit selectedWine", selectedWine);

        if (!formData.wine_id) {
            toast.error("Please select a wine first.");
            return;
        }

        if (!isAuthenticated) {
            toast.error("Please log in first.");
            return;
        }

        try {
            setIsSavingNote(true);

            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: audience,
                    scope: 'openid profile email'
                }
            });

            const res = await fetch(`${API_URL}/api/journal`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to save note");
            }

            toast.success("Tasting note saved!");

            onNoteAdded?.();

            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setIsSavingNote(false);
        }
    }

  return (
    <div
        className="fixed inset-0 z-[110] flex items-center justify-center bg-[rgba(61,11,26,0.55)] p-4 backdrop-blur-sm"
        onClick={onClose}
    >
        <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-[#dcc4ba] bg-[#fff8ef] p-6 text-left shadow-[0_30px_80px_rgba(61,11,26,0.28)] md:p-8"
        >
            <div className="mb-6 flex items-start justify-between gap-4 border-b border-[#ead7ce] pb-4">
                <div>
                    <h2 id={titleId} className="text-3xl font-semibold text-[#5b1228]">Add Tasting Note</h2>
                    <p className="mt-2 text-sm text-[#7a4c43]">
                        Save your tasting notes, mood, and flavor impressions.
                    </p>
                </div>
                <button
                    ref={closeButtonRef}
                    type="button"
                    aria-label="Close modal"
                    onClick={onClose}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6f102e] text-lg font-semibold text-[#fff9f2] transition hover:bg-[#581024]"
                >
                    ✕
                </button>
            </div>

            <div className="mb-6">
                <label className="mb-3 block text-sm font-semibold uppercase tracking-[0.14em] text-[#8f5a4c]">
                    Wine
                </label>

                <GlobalSearchBar 
                    value={searchInput}
                    onSearch={handleWineSearch}
                    id="wine-search"
                    label="Search for a wine"
                />
                    {isSearchingWines && (
                        <p className="mt-3 text-sm text-[#7a4c43]">Searching wines...</p>
                    )}

                    {selectedWine ? (
                        <div className="mt-4 rounded-2xl border border-[#dcc4ba] bg-[#f7ede3] p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8f5a4c]">
                                Selected wine
                            </p>
                            <div className="mt-3 flex items-center gap-4">
                                {getWineImageSrc(selectedWine.image_url) && (
                                    <img
                                        src={getWineImageSrc(selectedWine.image_url)}
                                        alt={selectedWine.name}
                                        className="h-20 w-14 rounded-xl object-contain"
                                    />
                                )}
                                <div>
                                    <p className="font-semibold text-[#5b1228]">{selectedWine.name}</p>
                                    <p className="text-sm text-[#7a4c43]">
                                        {selectedWine.winery || 'Unknown winery'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        winesResults.length > 0 && (
                        <div className="mt-4 max-h-72 space-y-3 overflow-y-auto rounded-2xl border border-[#dcc4ba] bg-[#fffdf8] p-3">
                            {winesResults.map((wine)=>{
                                return (
                                    <button
                                        key={wine.id}
                                        type="button"
                                        onClick={() => handleSelectWine(wine)}
                                        className="flex w-full items-center gap-4 rounded-2xl border border-[#ead7ce] bg-[#fff8ef] p-3 text-left transition hover:border-[#cfae9d] hover:bg-[#f7ede3]"
                                    >
                                        {getWineImageSrc(wine.image_url) && (
                                            <img
                                                src={getWineImageSrc(wine.image_url)}
                                                alt={wine.name}
                                                className="h-20 w-14 shrink-0 rounded-xl object-contain"
                                            />
                                        )}
                                        <div className="min-w-0">
                                            <p className="truncate font-semibold text-[#5b1228]">{wine.name}</p>
                                            <p className="truncate text-sm text-[#7a4c43]">
                                                {wine.winery || 'Unknown winery'}
                                            </p>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    ))}
            </div>

            <label className="mb-6 block">
                <span className="mb-2 block text-sm font-semibold uppercase tracking-[0.14em] text-[#8f5a4c]">
                    Price
                </span>
                <input 
                    name = "price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="19.99"
                    required
                    className="w-full rounded-2xl border border-[#cfae9d] bg-[#fffdf8] px-4 py-3 text-[#5b1228] outline-none transition placeholder:text-[#9b7567] focus:border-[#7a1733] focus:ring-4 focus:ring-[rgba(122,23,51,0.10)]"
                />
            </label>

            {sliderFields.map((field) => (
                <label key={field.name} className="mb-6 block">
                    <div className="mb-2 flex items-center justify-between">
                        <span className="block text-sm font-semibold uppercase tracking-[0.14em] text-[#8f5a4c]">
                            {field.label}
                        </span>
                        <span className="text-sm font-semibold text-[#5b1228]">{formData[field.name]}</span>
                    </div>

                    <input
                        name={field.name}
                        type="range"
                        min="0"
                        max="10"
                        value={formData[field.name]}
                        onChange={handleSliderChange}
                        required
                        className="w-full accent-[#6f102e]"
                    />
                </label>
            ))}

            <label className="mb-6 block">
                <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.14em] text-[#8f5a4c]">
                    Flavors
                </span>
                <div className="flex flex-wrap gap-2">
                {Object.keys(tagsByGroup).map((groupName) => {
                    const isSelected = selectedGroups.includes(groupName);
                    return (
                        <button
                            key={groupName}
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() => toggleGroup(groupName)}
                            className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
                                isSelected
                                ? "border-[#6f102e] bg-[#6f102e] text-white"
                                : "border-[#dcc4ba] bg-[#f2e2d6] text-[#5b1228]"
                            }`}
                        >
                            {groupName.replaceAll("_", " ")}
                        </button>
                    )
                })}
                </div>

                {selectedGroups.map((groupName) => (
                    <div key={groupName} className="mt-4 rounded-2xl border border-[#ead7ce] bg-[#fffdf8] p-4">
                        <span className="mb-3 block text-sm font-semibold capitalize text-[#5b1228]">
                            {groupName.replaceAll("_", " ")}
                        </span>
                        <div className="flex flex-wrap gap-2">
                        {tagsByGroup[groupName]?.map((tag) => {
                            const isSelected = formData.user_flavor.some((item) =>
                                item.group === groupName &&
                                item.notes.includes(tag.tag_name)
                            );

                            return (
                                <button
                                    key={tag.id}
                                    type="button"
                                    aria-pressed={isSelected}
                                    onClick={() => toggleFlavorTag(tag.tag_name, groupName)}
                                    className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
                                        isSelected
                                        ? "border-[#6f102e] bg-[#6f102e] text-white"
                                        : "border-[#dcc4ba] bg-[#f2e2d6] text-[#5b1228]"
                                    }`}
                                >
                                    {tag.tag_name.replaceAll("_", " ")}
                                </button>
                            )
                        })}
                        </div>
                    </div>
                ))}

                {formData.user_flavor.length>0 && (
                    <div className="mt-4 rounded-2xl bg-[#f7ede3] p-4">
                        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#8f5a4c]">
                            Selected flavors
                        </p>
                        {formData.user_flavor.map((flavorGroup) => (
                            <div key={flavorGroup.group} className="mb-2 text-sm text-[#5b1228] last:mb-0">
                                <span className="font-semibold capitalize">{flavorGroup.group.replaceAll("_", " ")}: </span>
                                <span className="text-[#7a4c43]">
                                    {flavorGroup.notes.map((note) =>
                                        note.replaceAll("_", " ")
                                    ).join(", ")}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </label>

            <label className="mb-6 block">
                <span className="mb-2 block text-sm font-semibold uppercase tracking-[0.14em] text-[#8f5a4c]">
                    Comment
                </span>
                <textarea
                    name = "comment"
                    value={formData.comment}
                    onChange={handleChange}
                    placeholder="What did you taste? (e.g. fruity, smooth, oak finish...)"
                    className="min-h-32 w-full rounded-2xl border border-[#cfae9d] bg-[#fffdf8] px-4 py-3 text-[#5b1228] outline-none transition placeholder:text-[#9b7567] focus:border-[#7a1733] focus:ring-4 focus:ring-[rgba(122,23,51,0.10)]"
                />
            </label>

            <button
                type="button"
                onClick={handleGenerateNote}
                disabled={isGenerating}
                className="mx-auto block rounded-full border border-[#6f102e] bg-[#f7ede3] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#6f102e] transition hover:bg-[#f2e2d6] disabled:cursor-not-allowed disabled:border-[#dcc4ba] disabled:bg-[#efe2d6] disabled:text-[#9b7567]"
            >
                {isGenerating ? "Magic in progress..." : "Generate AI Note"}
            </button>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isSavingNote}
                    className="rounded-full bg-[#6f102e] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#fff9f2] transition hover:bg-[#581024] disabled:cursor-not-allowed disabled:bg-[#9f5066]"
                >
                    {isSavingNote ? "Saving..." : "Submit"}
                </button>
            </div>
        </form>
    </div>
  )
}
