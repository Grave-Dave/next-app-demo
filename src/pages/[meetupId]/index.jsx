import Head from 'next/head';
import { MongoClient, ObjectId } from 'mongodb';

import MeetupDetail from '@/components/meetups/MeetupDetail';

function MeetupPage(props) {
	return (
		<>
			<Head>
				<title>{props.meetupData.title}</title>
				<meta name='description' content={props.meetupData.description} />
			</Head>
			<MeetupDetail {...props.meetupData} />
		</>
	);
}

export async function getStaticPaths() {
	const client = await MongoClient.connect(
		'mongodb+srv://dawgrab1:3F1lJGP9a4wIEYZx@cluster0.j3buxb1.mongodb.net/meetups?retryWrites=true&w=majority'
	);
	const db = client.db();

	const meetupsCollection = db.collection('meetups');

	const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();
	client.close();

	return {
		fallback: false,
		paths: meetups.map(meetup => ({ params: { meetupId: meetup._id.toString() } })),

		// [
		// 	{
		// 		params: {
		// 			meetupId: 'm1',
		// 		},
		// 	},
		// 	{
		// 		params: {
		// 			meetupId: 'm2',
		// 		},
		// 	},
		// ],
	};
}
export async function getStaticProps(context) {
	// fetch data for a single meetup
	const meetupId = context.params.meetupId;

	const client = await MongoClient.connect(
		'mongodb+srv://dawgrab1:3F1lJGP9a4wIEYZx@cluster0.j3buxb1.mongodb.net/meetups?retryWrites=true&w=majority'
	);
	const db = client.db();

	const meetupsCollection = db.collection('meetups');

	const selectedMeetup = await meetupsCollection.findOne({ _id: new ObjectId(meetupId) });

	client.close();

	return {
		props: {
			meetupData: {
				id: selectedMeetup._id.toString(),
				title: selectedMeetup.title,
				address: selectedMeetup.address,
				image: selectedMeetup.image,
				description: selectedMeetup.description,
			},
		},
	};
}

export default MeetupPage;
