import {FormEvent, JSX, SyntheticEvent, useEffect, useState} from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import Autocomplete from '@mui/material/Autocomplete'
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import {TypeJobseeker, TypeJobTitle, TypeTag} from "../../types/types.ts";
import {Link} from "@mui/material";

export default function Home(): JSX.Element | null {

    const [tags, setTags] = useState<TypeTag[]>([]);
    const [jobTitles, setJobTitles] = useState<TypeJobTitle[]>([]);
    const [jobseekers, setJobseekers] = useState<TypeJobseeker[]>([]);
    const [selectedJobTitle, setSelectedJobTitle] = useState<TypeJobTitle>();
    const [selectedTags, setSelectedTags] = useState<TypeTag[]>([]);

    function loadTags() {
        fetch('https://vacancyprojectwebapi.onrender.com/tags/').then(text => text.json()).then(data => {
            setTags((data as TypeTag[]))
        });
    }

    function loadJobTitles() {
        fetch('https://vacancyprojectwebapi.onrender.com/job-titles/').then(text => text.json()).then(data => {
            setJobTitles((data as TypeJobTitle[]))
        });
    }

    function loadJobseekers() {
        fetch('https://vacancyprojectwebapi.onrender.com/jobseekers/').then(text => text.json()).then(data => {
            setJobseekers((data as TypeJobseeker[]))
        });
    }

    useEffect(() => {
        loadJobTitles();
    }, []);

    useEffect(() => {
        loadTags();
    }, []);

    useEffect(() => {
        loadJobseekers();
    }, []);

    const handleRegister = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        let url: string = 'https://vacancyprojectwebapi.onrender.com/jobseekers/'
        const data: FormData = new FormData(e.currentTarget);


        if (
            selectedJobTitle !== undefined &&
            selectedTags.length > 0 &&
            data.get('firstName') !== null &&
            data.get('lastName') !== null &&
            data.get('email') !== null
        ) {

            let jobseeker: TypeJobseeker = {
                // @ts-ignore
                firstname: data.get('firstName'),
                // @ts-ignore
                lastname: data.get('lastName'),
                // @ts-ignore
                email: data.get('email'),
                jobTitleId: selectedJobTitle.id,
                tagIds: selectedTags.map((tag) => tag.id)
            }

            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(jobseeker)
            }).then(() => {
                setJobseekers(prev => [...prev, jobseeker]);
            });
        }
    }

    function getTags(jobseeker: TypeJobseeker): string {
        let tagsString: string = '';
        for (const item of jobseeker.tagIds) {
            const tag = tags.find(x => x.id === item);
            if (tag) {
                tagsString += tag.name + ' ';
            }
        }

        return tagsString
    }

    if (tags.length === 0 || jobTitles.length === 0) {
        return <div>loading</div>
    }

    return (
        <Box>
            <Box sx={{m: 1}} display="flex" flexDirection="row">
                <Box component='form' onSubmit={handleRegister} sx={{width: 1 / 4}}>
                    <TextField
                        sx={{mt: 1}}
                        id="firstName"
                        name="firstName"
                        label="First Name"
                        autoComplete="given-name"
                        fullWidth
                        required
                        autoFocus
                    />
                    <TextField
                        sx={{mt: 1}}
                        id="lastName"
                        name="lastName"
                        label="Last Name"
                        autoComplete="family-name"
                        fullWidth
                        required
                    />

                    <TextField
                        sx={{mt: 1}}
                        id="email"
                        name="email"
                        label="Email Address"
                        autoComplete="email"
                        fullWidth
                        required
                    />
                    <FormControl fullWidth sx={{mt: 1}}>
                        <Autocomplete
                            id="jobTitle"
                            options={jobTitles}
                            getOptionLabel={(jobTitle) => jobTitle.name}
                            renderInput={(params) => <TextField {...params} label="Job title"/>}
                            disablePortal
                            onChange={                            //@ts-ignore
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
                            Register
                        </Button>
                        <Link href="find-jobseeker">Find a jobseeker</Link>
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
                            {jobseekers.map((jobseeker) => (
                                <TableRow
                                    key={jobseeker.firstname}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell component="th" scope="row">{jobseeker.firstname}</TableCell>
                                    <TableCell component="th" scope="row">{jobseeker.lastname}</TableCell>
                                    <TableCell align="right">{jobseeker.email}</TableCell>
                                    <TableCell
                                        align="right">{jobTitles.find(x => x.id == jobseeker.jobTitleId)!.name}</TableCell>
                                    <TableCell align="right">{getTags(jobseeker)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    )
}
