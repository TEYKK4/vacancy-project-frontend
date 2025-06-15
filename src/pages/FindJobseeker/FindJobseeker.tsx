import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {FormEvent, JSX, SyntheticEvent, useEffect, useState} from "react";
import Button from "@mui/material/Button";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {TypeJobseeker, TypeJobTitle, TypeTag} from "../../types/types.ts";
import {Link} from "@mui/material";

export default function FindJobseeker(): JSX.Element | null {

    const [tags, setTags] = useState<TypeTag[]>([]);
    const [jobTitles, setJobTitles] = useState<TypeJobTitle[]>([]);
    const [selectedJobTitle, setSelectedJobTitle] = useState<TypeJobTitle>();
    const [matchedJobseekers, setMatchedJobseekers] = useState<TypeJobseeker[]>([]);
    const [selectedTags, setSelectedTags] = useState<TypeTag[]>([]);

    function loadTags() {
        fetch('http://localhost:5225/tags/').then(text => text.json()).then(data => {
            setTags((data as TypeTag[]))
        });
    }

    function loadJobTitles() {
        fetch('http://localhost:5225/job-titles/').then(text => text.json()).then(data => {
            setJobTitles((data as TypeJobTitle[]))
        });
    }

    useEffect(() => {
        loadJobTitles();
    }, []);

    useEffect(() => {
        loadTags();
    }, []);

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        let url: string = 'http://localhost:5225/jobseekers/matched'

        if (selectedJobTitle != undefined && selectedTags.length > 0) {
            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                        jobTitleId: selectedJobTitle.id,
                        tagIds: selectedTags.map((tag) => tag.id)
                    }
                )
            }).then(text => text.json()).then(data => setMatchedJobseekers((data as TypeJobseeker[])));
        }
    }

    function getTags(jobseeker: TypeJobseeker): string {
        let tagsString: string = '';
        for (const item of jobseeker.tagIds) {
            tagsString += tags.find(x => x.id == item)!.name;
            tagsString += ' ';
        }

        return tagsString
    }

    if (!tags || !jobTitles) {
        return <div>loading</div>
    }

    return (
        <Box sx={{m: 1}} display="flex" flexDirection="row">
            <Box component='form' onSubmit={handleSearch} sx={{width: 1 / 4}}>
                <FormControl fullWidth sx={{mt: 1}}>
                    <Autocomplete
                        id="jobTitle"
                        options={jobTitles}
                        getOptionLabel={(jobTitle) => jobTitle.name}
                        renderInput={(params) => <TextField {...params} label="Job title"/>}
                        disablePortal
                        onChange={
                            //@ts-ignore
                            (e, selectedJobTitle: TypeJobTitle | null) => {
                                if (selectedJobTitle != null) {
                                    setSelectedJobTitle(selectedJobTitle)
                                }
                            }}
                    />
                </FormControl>

                <FormControl fullWidth sx={{mt: 1}}>
                    <Autocomplete
                        id="tags"
                        options={tags}
                        getOptionLabel={(tag) => tag.name}
                        renderInput={(params) => <TextField {...params} label="Tags"/>}
                        disablePortal
                        multiple
                        disableCloseOnSelect
                        onChange={
                            // @ts-ignore
                            (e: SyntheticEvent<Element, Event>, selectedTags: TypeTag[]) => {
                                if (selectedTags != null) {
                                    setSelectedTags(selectedTags);
                                }
                            }}
                    />
                </FormControl>
                <Box>
                    <Button
                        sx={{mt: 1, mb: 1}}
                        type="submit"
                        fullWidth
                        variant="contained"
                    >
                        Search
                    </Button>
                    <Link href="/">Add a jobseeker</Link>
                </Box>
            </Box>

            <TableContainer sx={{ml: 5}} component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Surname</TableCell>
                            <TableCell align="right">Email</TableCell>
                            <TableCell align="right">Job Title</TableCell>
                            <TableCell align="right">Tags</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {matchedJobseekers.map((jobseeker) => (
                            <TableRow
                                key={jobseeker.firstname}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell component="th" scope="row">{jobseeker.firstname}</TableCell>
                                <TableCell component="th" scope="row">{jobseeker.lastname}</TableCell>
                                <TableCell align="right">{jobseeker.email}</TableCell>
                                <TableCell align="right">{jobTitles.find(x => x.id == jobseeker.jobTitleId)!.name}</TableCell>
                                <TableCell align="right">{getTags(jobseeker)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}