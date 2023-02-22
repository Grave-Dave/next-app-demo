import { Fragment } from 'react';
import Head from 'next/head';
import { MongoClient } from 'mongodb';

import MeetupList from '@/components/meetups/MeetupList';

// const DUMMY_MEETUPS = [
// 	{
// 		id: 'm1',
// 		title: 'A first meetup',
// 		image:
// 			'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=765&q=80',
// 		address: 'Sime address 5, 12345 Some City',
// 		description: 'This is a first meetup',
// 	},
// 	{
// 		id: 'm2',
// 		title: 'A second meetup',
// 		image:
// 			'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=765&q=80',
// 		address: 'Sime address 5, 12345 Some City',
// 		description: 'This is a second meetup',
// 	},
// ];

function HomePage(props) {
	return (
		<>
			<Head>
        <title>React Meetups</title>
        <meta name='description' content='Browse a huge list of highly active React meetups!'/>
      </Head>
			<MeetupList meetups={props.meetups} />
		</>
	);
}

export async function getStaticProps() {
	// fetch data from API

	const client = await MongoClient.connect(
		'mongodb+srv://dawgrab1:3F1lJGP9a4wIEYZx@cluster0.j3buxb1.mongodb.net/meetups?retryWrites=true&w=majority'
	);
	const db = client.db();

	const meetupsCollection = db.collection('meetups');

	const meetups = await meetupsCollection.find().toArray();

	client.close();

	return {
		props: {
			meetups: meetups.map(meetup => ({
				title: meetup.title,
				address: meetup.address,
				image: meetup.image,
				id: meetup._id.toString(),
			})),
		},
		revalidate: 1,
	};
}

export default HomePage;
